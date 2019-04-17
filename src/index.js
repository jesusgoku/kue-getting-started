import express from 'express';
import bodyParser from 'body-parser';
import kue from 'kue';

const PORT = process.env.PORT || 3000;
const REDIS_DSN = process.env.REDIS_DSN || 'redis://redis:6379?db=0';

const app = express();
const queue = kue.createQueue({
  redis: REDIS_DSN,
});

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown( 5000, function(err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

// kue.app.listen(3001);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(kue.app);

app.post('/task', (req, res) => {
  const { task, priority = 'normal', attempts = 5, payload = {} } = req.body;

  if (!task) return res.status(400).json({ error: 'task not found' });

  const job = queue.create(task, payload)
    .priority(priority)
    .attempts(attempts)
    .save(err => {
      if (err) res.status(500).json({ error: err.message });

      const { id, created_at } = job;
      res.status(201).json({ task, payload, priority, attempts, id, created_at });
    })
  ;
});

app.listen(PORT, () => console.log(`http://0.0.0.0:${PORT}`));

/*
{
    low: 10
  , normal: 0
  , medium: -5
  , high: -10
  , critical: -15
};
*/




