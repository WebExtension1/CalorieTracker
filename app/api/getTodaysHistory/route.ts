import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings()

export async function GET() {
  try {
    // Connect to db
    const connection = await mysql.createConnection(connectionParams)
    
    const query = 'SELECT foods.name, foods.calories, history.quantity FROM foods JOIN history ON foods.foodID = history.foodID WHERE history.eatenDate = CURDATE();'
    const values: (string | number | null)[] = []

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