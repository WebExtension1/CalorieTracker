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
    const values = [calories];

    if (newName) {
      if (name.trim() != "") {
        query += ", name = @newName";
        values.push(newName);
      }
    }

    query += " WHERE name = @name";
    values.push(name.split('%20').join(' '));

    let index = 1;

    const requestQuery = connection.request()
      .input('calories', sql.Int, values[0]);

    if (values.length === 3) {
      requestQuery.input('newName', sql.NVarChar, values[1]);
      index++;
    }

    requestQuery.input('name', sql.NVarChar, values[index]);

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
