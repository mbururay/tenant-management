const MiniStatement = ({statement, close}) => {

return (

<div className="statementModal">

<h2>Tenant Statement</h2>

<table>

<thead>
<tr>
<th>Date</th>
<th>Type</th>
<th>Description</th>
<th>Amount</th>
<th>Balance</th>
</tr>
</thead>


<tbody>

{
statement.map((s,index)=>(

<tr key={index}>

<td>
{new Date(s.date).toLocaleDateString()}
</td>

<td>
{s.type}
</td>

<td>
{s.description}
</td>

<td>
{Number(s.amount).toLocaleString()}
</td>

<td>
{Number(s.balance).toLocaleString()}
</td>

</tr>

))
}

</tbody>

</table>


<button onClick={close}>
Close
</button>

</div>

);

};

export default MiniStatement;