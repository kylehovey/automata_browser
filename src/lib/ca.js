/**
 * A rule number is a bit-map of birth and survival rules
 * in a life-like CA rule definition. For instance,
 * the Game of Life (B3/S23) would be:
 * 0b000001100000001000 = 6152
 *   ||||||||||||||||||
 *   876543210876543210
 *   ||||||||||||||||||
 *   SSSSSSSSSBBBBBBBBB
 */
export const ruleFor = (ruleNumber) => (neighbors, alive) => {
  if (alive) {
    for (let bit = 9; bit < 18; ++bit) {
      const mask = 1 << bit;
      const neighborCount = bit - 9;
      const cares = (mask & ruleNumber) !== 0;

      if (cares && neighbors === neighborCount) return true;
    }
  } else {
    for (let bit = 0; bit < 9; ++bit) {
      const mask = 1 << bit;
      const neighborCount = bit;
      const cares = (mask & ruleNumber) !== 0;

      if (cares && neighbors === neighborCount) return true;
    }
  }

  return false;
};

export const nameForRule = (rule) => {
  let out = "B";

  for (let neighborCount = 0; neighborCount < 9; ++neighborCount) {
    if (rule(neighborCount, false)) out += neighborCount.toString();
  }

  out += "/S";

  for (let neighborCount = 0; neighborCount < 9; ++neighborCount) {
    if (rule(neighborCount, true)) out += neighborCount.toString();
  }

  return out;
}

export const nameForRuleNumber = (ruleNumber) => nameForRule(ruleFor(ruleNumber));

export const register = (ruleNumber) => {
  const rule = ruleFor(ruleNumber);
  const type = nameForRule(rule);

  window.terra.registerCA({
    type,
    colorFn() {
      return this.alive ? this.color + ',1' : '0,0,0,0';
    },
    process(neighbors, x, y) {
      const neighborCount = neighbors
        .filter(({ creature }) => creature.alive)
        .length;

      this.alive = rule(neighborCount, this.alive);

      return true;
    },
  }, function() {
    this.alive = Math.random() < 0.5;
  });

  return type;
};
