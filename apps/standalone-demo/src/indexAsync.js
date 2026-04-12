// asynchronous start boundary for webpack dynamic module loading
import('./startApp').then(({ startApp }) => startApp());
