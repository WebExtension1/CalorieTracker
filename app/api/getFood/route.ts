import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings()

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const typeID = url.searchParams.get("typeID");
    
    // Connect to db
    const connection = await mysql.createConnection(connectionParams)

    let query = 'SELECT * FROM foods'
    const values: (string | number | null)[] = []

    if (typeID) {
      query += ' WHERE typeID = ?'
      values.push(Number(typeID)); // Ensure it's a number
    }

    // Execute and get results
    const [results] = await connection.execute(query, values)

    // Close db connection
    connection.end()

    // return the results as a JSON API response
    return NextResponse.json(results)
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
  }
}