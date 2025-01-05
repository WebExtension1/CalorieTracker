import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings()

export async function POST(request: Request) {
  try {
    const { name, calories, type } = await request.json();

    if (!name || !calories) {
        console.error("Missing parameters");
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await mysql.createConnection(connectionParams)

    const query = 'INSERT INTO foods (name, calories, typeID) VALUES (?, ?, ?)';
    const values = [name.replace("%20", " "), calories, type];

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