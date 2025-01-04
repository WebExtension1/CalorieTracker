import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings()

export async function POST(request: Request) {
  try {
    const { name, quantity } = await request.json();

    if (!name || !quantity) {
        console.error("Missing parameters");
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await mysql.createConnection(connectionParams)

    let query = 'SELECT foodID FROM foods WHERE name = ?'
    let values = [name.replace("%20", " ")];

    // Execute and get results
    let [results]: [Array<{ foodID: number }>, (string | number | null)] = await connection.execute(query, values);

    query = 'INSERT INTO history (foodID, quantity) VALUES (?, ?)';
    values = [results[0].foodID, quantity];

    // Execute and get results
    [results] = await connection.execute(query, values)

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