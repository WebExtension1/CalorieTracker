import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings().connectionParams;

export async function POST(request: Request) {
  try {
    const { calories, name, newName } = await request.json();

    if (!calories || !name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await sql.connect(connectionParams);

    let query = "UPDATE foods SET calories = @calories";
    let values = [calories];

    if (newName) {
      if (trim(name) != "") {
        query += ", name = @newName"
        values.push(newName)
    }

    query += " WHERE name = @name";
    values.push(name.split('%20').join(' '));
    
    // Execute and get results
    const results = await connection.request()
      .input('calories', sql.Int, values[0])
      .input('name', sql.NVarChar, values[1])
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
