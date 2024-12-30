import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings } from '@/sharedCode/common'

// Get the connection parameters
let connectionParams = GetDBSettings()

export async function POST(request: Request) {
  try {
    const { calories, name } = await request.json();

    if (!calories || !name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await mysql.createConnection(connectionParams)

    let query = 'UPDATE foods SET calories = ? WHERE name = ?'
    let values = [calories, name];

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