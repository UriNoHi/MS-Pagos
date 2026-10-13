import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ Conectado a MongoDB (base: ${mongoose.connection.name})`);
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

// true si la conexión está abierta (readyState 1 = connected)
export function dbConectada() {
  return mongoose.connection.readyState === 1;
}
