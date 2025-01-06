import { NextResponse } from 'next/server'
import sql from 'mssql'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings().connectionParams;

export async function POST(request: Request) {
  try {
    const { name, quantity } = await request.json();

    if (!name || !quantity) {
        console.error("Missing parameters");
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await sql.connect(connectionParams)

    const query1 = 'SELECT foodID FROM foods WHERE name = @name';
    
    const request1 = connection.request();
    request1.input('name', sql.NVarChar, name.replace("%20", " "));

    const results1 = await request1.query(query1);

    // Check if results are empty
    if (results1.recordset.length === 0) {
        throw new Error('No food found with the given name.');
    }

    const foodID = results1.recordset[0].foodID;

    // Step 2: Insert into history
    const query2 = 'INSERT INTO history (foodID, quantity) VALUES (@foodID, @quantity)';
    
    const request2 = connection.request();
    request2.input('foodID', sql.Int, foodID);
    request2.input('quantity', sql.Int, quantity);

    const results2 = await request2.query(query2);

    // return the results as a JSON API response
    return NextResponse.json(results2)
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
  }
}