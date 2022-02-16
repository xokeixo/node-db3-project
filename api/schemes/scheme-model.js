const db = require('../../data/db-config');

async function find() { 
  try {
    return db('schemes as sc')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme.id', '=', 'st.scheme.id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
  } catch(err) {
    return(err)
  }
}

async function findById(scheme_id) { 
  const rows = await db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
  .select('st.*', 'sc.scheme_name', 'sc.scheme_id')
  .where('sc.scheme_id', '=', scheme_id)
  .orderBy('st.step_number');

const result = {
  scheme_id: rows[0].scheme_id,
  scheme_name: rows[0].scheme_name,
  steps: []
}
rows.forEach(row => {
  if(row.step_id) {
    result.steps.push({
      step_id: row.step_id,
      step_number: row.step_number,
      instructions: row.instructions
    })
  }
})
return result;
}

async function findSteps(scheme_id) { 
  const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
      .select(
        'st.step_id', 
        'st.step_number',
        'st.instructions',
        'sc.scheme_name')
      .where('sc.scheme_id', '=', scheme_id)
      .orderBy('st.step_number ');

      if (!rows[0].step_id) return[];
      return rows;
}

async function add(scheme) { 
  return db('schemes').insert(scheme)
  .then(([scheme_id]) => {
    return db('schemes').where('scheme_id', scheme_id);
  })
}

// async function addStep(scheme_id, step) { 
//   await db("steps").insert({ scheme_id, ...step });
//   const steps = await findSteps(scheme_id);
//   return steps;
// };


module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
