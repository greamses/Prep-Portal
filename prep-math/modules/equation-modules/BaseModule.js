// modules/equation-modules/BaseModule.js

export class EquationModule {
  constructor(classId, topic) {
    this.classId = classId;
    this.topic = topic;
  }
  
  canHandle() {
    return false;
  }
  
  generate() {
    return null;
  }
  
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  getRangeForLevel() {
    const ranges = {
      'p1': { minX: 1, maxX: 10, minConst: 1, maxConst: 5 },
      'p2': { minX: 1, maxX: 20, minConst: 1, maxConst: 10 },
      'p3': { minX: 1, maxX: 50, minConst: 2, maxConst: 20 },
      'p4': { minX: 2, maxX: 100, minConst: 3, maxConst: 30 },
      'p5': { minX: 3, maxX: 150, minConst: 5, maxConst: 50 },
      'p6': { minX: 5, maxX: 200, minConst: 10, maxConst: 75 },
      'jss1': { minX: 5, maxX: 100, minConst: 5, maxConst: 50 },
      'jss2': { minX: 10, maxX: 150, minConst: 10, maxConst: 75 },
      'jss3': { minX: 15, maxX: 200, minConst: 15, maxConst: 100 },
      'ss1': { minX: 20, maxX: 250, minConst: 20, maxConst: 120 },
      'ss2': { minX: 25, maxX: 300, minConst: 25, maxConst: 150 },
      'ss3': { minX: 30, maxX: 350, minConst: 30, maxConst: 180 }
    };
    return ranges[this.classId] || ranges['jss1'];
  }
}