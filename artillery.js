
let i = 100;

const counter = (context, events, done) => {
  i += 1;
  context.vars.count = i;
  return done();
};

module.exports = {
  counter,
};
