import { NextResponse } from 'next/server'
import mysql, { RowDataPacket, OkPacket, FieldPacket } from 'mysql2/promise'
import { GetDBSettings } from '@/sharedCode/common'

// Get the connection parameters
const connectionParams = GetDBSettings()

export async function POST(request: Request) {
  try {
    const { name, quantity } = await request.json();

    if (!name || !quantity) {
        console.error("Missing parameters");
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Connect to db
    const connection = await mysql.createConnection(connectionParams)

    const query1 = 'SELECT foodID FROM foods WHERE name = ?';
    const values1 = [name.replace("%20", " ")];

    // Execute the query and assert the type
    const [results1, _fields1]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query1, values1);

    // Check if results are empty
    if (results1.length === 0) {
        throw new Error('No food found with the given name.');
    }

    const foodID = results1[0].foodID;

    // Step 2: Insert into history
    const query2 = 'INSERT INTO history (foodID, quantity) VALUES (?, ?)';
    const values2 = [foodID, quantity];

    // Execute the insertion
    const [results2, _fields2]: [OkPacket, FieldPacket[]] = await connection.execute(query2, values2);


    // Close db connection
    connection.end()

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