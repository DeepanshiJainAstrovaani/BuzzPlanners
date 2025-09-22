import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Clear guidance for local dev
  throw new Error(
    'MONGODB_URI is not set. Create a .env.local at project root with\n' +
    'MONGODB_URI="<your Mongo connection string>"\n' +
    'Example (Atlas): MONGODB_URI="mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority"\n' +
    'Example (local): MONGODB_URI="mongodb://127.0.0.1:27017/buzzplanners"'
  );
}

const uri = MONGODB_URI as string;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
