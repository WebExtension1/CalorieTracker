import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings().connectionParams;

export async function GET() {
  try {
    // Connect to db
    const connection = await sql.connect(connectionParams)
    
    const query = 'SELECT foods.name, foods.calories, history.quantity FROM foods JOIN history ON foods.foodID = history.foodID WHERE CONVERT(date, history.eatenDate) = CONVERT(date, GETDATE());'

    const results = await connection.request()
      .query(query);

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