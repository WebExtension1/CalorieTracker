import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

const connectionParams = GetDBSettings().connectionParams;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const typeID = url.searchParams.get("typeID");
    
    // Connect to db
    const connection = await sql.connect(connectionParams)

    let query = 'SELECT * FROM foods'
    const values: (string | number | null)[] = []

    if (typeID) {
      query += ' WHERE typeID = @typeID'
      values.push(Number(typeID));
    }

    const requestQuery = connection.request();

    if (values.length > 0) {
      requestQuery.input('typeID', sql.Int, values[0]);
    }

    const results = await requestQuery.query(query);

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