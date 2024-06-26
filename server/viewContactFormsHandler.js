const pool = require('./database');
const getPostData = require('./postDataParser');

async function viewContactFormsHandler(req, res) {
  try {
    const { startDate, endDate } = await getPostData(req);


    const query = `
      SELECT SubmissionID, Cname, Cemail, DATE_FORMAT(Cdate, '%Y-%m-%d %h:%i %p') AS Cdate, CType, Content, TicketID
      FROM contact_us_form
      WHERE Cdate BETWEEN ? AND ?
    `;

    // Execute the query
    const [rows] = await pool.execute(query, [
      new Date(startDate),
      new Date(endDate + ' 23:59:59'), //this includes the hwole day 
    ]);

    // Return the contact forms as JSON
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error('Error retrieving contact forms:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

module.exports = viewContactFormsHandler;