import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings().connectionParams;

export async function POST(request: Request) {
  try {
    const { name, quantity } = await request.json();

    if (!name || !quantity) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await sql.connect(connectionParams)

    const query = 'DELETE TOP (1) h FROM history h INNER JOIN foods f ON f.foodID = h.foodID WHERE f.name = @name AND h.quantity = @quantity;'
    const values = [name.split('%20').join(' '), quantity];

    // Execute and get results
    const results = await connection.request()
      .input('name', sql.NVarChar, values[0])
      .input('quantity', sql.Int, values[1])
      .query(query)

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
