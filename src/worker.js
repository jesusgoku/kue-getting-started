import kue from 'kue';

const REDIS_DSN = process.env.REDIS_DSN || 'redis://redis:6379?db=0';

const queue = kue.createQueue({
  redis: REDIS_DSN,
});

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown( 5000, function(err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

queue.process('some', 2, (job, done) => {
  const { id, type: task, data: payload, _priority: priority, _max_attempts: attempts, created_at } = job;

  console.log({ id, task, payload, priority, attempts, created_at: new Date(+created_at) });

  setTimeout(done, Math.random() * 5000);
});
