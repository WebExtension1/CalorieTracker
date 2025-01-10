import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings().connectionParams;

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await sql.connect(connectionParams)

    let query = "DELETE FROM history WHERE name = @name";
    const values = [name.split('%20').join(' ')];

    query = 'DELETE FROM history WHERE name = @name';

    let results = await connection.request()
      .input('name', sql.NVarChar, values[0])
      .query(query)

    query = 'DELETE FROM foods WHERE name = @name';
    
    // Execute and get results
    results = await connection.request()
      .input('name', sql.NVarChar, values[0])
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
