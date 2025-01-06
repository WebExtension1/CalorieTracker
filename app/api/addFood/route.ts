import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

const connectionParams = GetDBSettings().connectionParams;

export async function POST(request: Request) {
  try {
    // Get POSTed variables
    const { name, calories, type } = await request.json();

    // Check for missing params
    if (!name || !calories) {
      console.error("Missing parameters");
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await sql.connect(connectionParams)

    const query = 'INSERT INTO foods (name, calories, typeID) VALUES (@name, @calories, @type)';
    
    const results = await connection.request()
      .input('name', sql.NVarChar, name)
      .input('calories', sql.Int, calories)
      .input('type', sql.Int, type)
      .query(query);

    // Return the results
    return NextResponse.json(results)
  } catch (err) {
    // Error handling
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,
      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
  }
}