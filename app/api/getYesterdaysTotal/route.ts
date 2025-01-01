import { NextResponse, NextRequest } from 'next/server'
import mysql from 'mysql2/promise'
import { GetDBSettings, IDBSettings } from '@/sharedCode/common'

// Get the connection parameters
let connectionParams = GetDBSettings()

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const typeID = url.searchParams.get("typeID");
    
    // Connect to db
    const connection = await mysql.createConnection(connectionParams)
    
    let date = new Date()
    date.setDate(date.getDate() - 1)
    let query = 'SELECT SUM(foods.calories * history.quantity) AS total_calories FROM foods JOIN history ON foods.foodID = history.foodID WHERE history.eatenDate = DATE_SUB(CURDATE(), INTERVAL 1 DAY);'
    let values = [date.getDate()]

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