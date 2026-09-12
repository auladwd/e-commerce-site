import mongoose from "mongoose";
import dns from "dns";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Resolves mongodb+srv:// URIs using public DNS (8.8.8.8) to bypass
 * local ISP router issues on Windows where SRV queries return ECONNREFUSED.
 */
async function getEffectiveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);

    const srvMatch = uri.match(
      /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/
    );

    if (!srvMatch) return uri;

    const [, user, pass, host, dbPath = "", query = ""] = srvMatch;
    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);

    if (!srvRecords || srvRecords.length === 0) return uri;

    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
    const cleanDb = dbPath || "/test";
    const cleanQuery = query
      ? query.includes("ssl=")
        ? query
        : `${query}&ssl=true&authSource=admin`
      : "?ssl=true&authSource=admin";

    const resolved = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(
      pass
    )}@${hosts}${cleanDb}${cleanQuery}`;

    return resolved;
  } catch (err) {
    console.warn("SRV resolution fallback to original URI:", err);
    return uri;
  }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = getEffectiveMongoUri(rawUri)
      .then((effectiveUri) => mongoose.connect(effectiveUri, opts))
      .then((mongooseInstance) => {
        console.log("MongoDB Atlas connected successfully to:", mongooseInstance.connection.name);
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB Atlas connection error:", err);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB Atlas:", e);
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;
