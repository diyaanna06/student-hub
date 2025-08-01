import mongoose from 'mongoose'

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined')
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    })

    connection.isConnected = db.connections[0].readyState
  } catch (error) {
    // Log only the error type and message, not the full error object
    console.error(
      'Database connection failed:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    // Don't exit the process, just throw the error to be handled by the API route
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export default dbConnect
