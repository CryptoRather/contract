class Question {
  constructor(public scenarioA: Scenario, public scenarioB: Scenario) {
  }

  toString(): string {
    return JSON.stringify(this)
  }
}

class Scenario {
  public id: string
  public scenario: string
  public category: string
  public votes: BigNumber

  constructor(json?: string) {
    if (json) {
      const object: ScenarioObject = JSON.parse(json)

      this.id = object.id
      this.scenario = object.scenario
      this.category = object.category

      if (!object.votes) {
        this.votes = new BigNumber(0)
      } else {
        if (!(object.votes instanceof BigNumber)) {
          this.votes = new BigNumber(object.votes)
        } else {
          this.votes = object.votes
        }
      }
    }
  }

  toString(): string {
    return JSON.stringify(this)
  }
}

interface ScenarioObject {
  id: string
  scenario: string
  category: string
  votes: any
}

const rawScenarios = [{scenario:"listen to only Christmas music for the rest of your life",category:"music"},{scenario:"listen to only funeral music for the rest of your life",category:"music"},{scenario:"don't ever listen to music again",category:"music"},{scenario:"eat 100 ants",category:"food"},{scenario:"eat 60 beetles",category:"food"},{scenario:"eat 5 bees",category:"food"},{scenario:"get 1 Bitcoin for free",category:"crypto"},{scenario:"get 12 Ethereum for free",category:"crypto"},{scenario:"get 1140 Nebulas for free",category:"crypto"},{scenario:"be a character in your favorite game for the rest of your life",category:"dilemma"},{scenario:"be a character in your favorite movie for the rest of your life",category:"dilemma"},{scenario:"have the ability to rewind 24 hours three times each year",category:"dilemma"},{scenario:"be able to consciously control all your dreams and remember them in great detail",category:"dilemma"},{scenario:"smile when bad things happen",category:"smile"},{scenario:"frown when good things happen",category:"smile"},{scenario:"forget who you are",category:"forget"},{scenario:"forget who everyone else is",category:"forget"},{scenario:"only be able to eat/drink protein shakes for the rest of your life",category:"diet"},{scenario:"not be hungry ever again",category:"diet"},{scenario:"never be able to use any Google products ever again",category:"internet"},{scenario:"be a god",category:"be"},{scenario:"be a devil",category:"be"},{scenario:"not kill someone and end up in jail for life",category:"crime"},{scenario:"kill someone yourself and have your best friend end up in jail for life",category:"crime"},{scenario:"have all limbs surgically removed",category:"surgery"},{scenario:"have only one limb that you choose be torn off",category:"surgery"},{scenario:"get severe hiccups every 15 minutes",category:"annoying"},{scenario:"be buried alive with a blowtorch and man-eating ants",category:"death"},{scenario:"have a deep itch that takes more than 20 scratches to go away and that shows up every ten minutes",category:"annoying"},{scenario:"need permission before being able to do absolutely anything",category:"annoying"},{scenario:"know the exact place and time of your death",category:"death"},{scenario:"never be able to wear socks and shoes ever again",category:"pain"},{scenario:"jump from a 1 story building and land onto scattered legos barefoot",category:"pain"},{scenario:"pee your pants once a week at a random time",category:"annoying"},{scenario:"work 4 days a week but work 20 hour days",category:"annoying"},{scenario:"have absolutely no one you have met or will meet like or respect you",category:"pain"},{scenario:"bare knuckle fight a pissed off Mike Tyson in his prime",category:"pain"},{scenario:"only be able to use the internet 20 minutes a day",category:"internet"},{scenario:"have to pay the government a tax for every word you speak",category:"annoying"},{scenario:"have to eat a very moldy meal once a week",category:"diet"},{scenario:"erase every computer from history",category:"internet"},{scenario:"have to pay EVERYTHING in nothing but pennies for the rest of your life",category:"annoying"},{scenario:"gain super-human sense of smell, but only for horrible vomit inducing smells",category:"gross"},{scenario:"have all teeth you have fall out if you don't whistle for at least 1 out of every 4 hours",category:"annoying"},{scenario:"be the only human on Earth to survive a major catastrophic event",category:"pain"},{scenario:"not able remember anything new from this point on and have your memory reset every 6 hours",category:"pain"},{scenario:"volunteer for a pointless space mission that has a 25% chance of returning to Earth",category:"death"},{scenario:"have something installed into your eyes that permanently show advertisements  that block 80% of your vision",category:"annoying"},{scenario:"be limited to communicate only one word a minute",category:"annoying"},{scenario:"have your total bank balances taken away from you every 24 hours",category:"annoying"},{scenario:"replace every cat and dog on Earth with a brain eating zombie",category:"death"},{scenario:"have everything you consume with water be replaced with dirty bath water",category:"diet"},{scenario:"hear all voices and sounds at an annoying nails-on-chalkboard high pitch",category:"pain"},{scenario:"have all the favorite parts of songs you like be replaced with the Amber Alert noise and you forget it will happen every time",category:"music"},{scenario:"have to lick a persons face every time they say a sentence to you",category:"gross"},{scenario:"have to drink nothing but earwax whenever you get thirsty",category:"gross"},{scenario:"have to step on a set bear trap until it slams shut on your leg every 9 months",category:"pain"},{scenario:"be stuck on a space station alone with no communication but have lifetime supply of canned beans and water, with 100% certainty of rescue, but not sure if it will be in 1 hour or 25 years",category:"death"},{scenario:"have to rip out all of your hair and every finger and toe nail once a year with no anesthetics",category:"pain"},{scenario:"have very bad headache every day",category:"pain"},{scenario:"have very bad stomach ache every day",category:"pain"},{scenario:"always feel like you're about to sneeze",category:"annoying"}]

class CryptoEitherContract {
  scenarios: ContractStorage<Scenario>
  scenarioCount: number
  ownerAddress: Address

  constructor() {
    LocalContractStorage.defineMapProperty(this, 'scenarios', {
      parse(json: string) {
        return new Scenario(json)
      },
      stringify(object: Scenario) {
        return object.toString()
      }
    })

    LocalContractStorage.defineProperty(this, 'scenarioCount', null)
    LocalContractStorage.defineProperty(this, 'ownerAddress', null)
  }

  init() {
    this.scenarioCount = 0

    for (let i = 0; i < rawScenarios.length; i++) {
      this.scenarios.set(i, new Scenario(JSON.stringify({
        ...rawScenarios[i],
        id: i
      })))
    }

    this.scenarioCount = rawScenarios.length
    this.ownerAddress = Blockchain.transaction.from
  }

  add(scenarioA: ScenarioObject, scenarioB: ScenarioObject) {
    const category = this.scenarioCount.toString()

    this.scenarios.set(this.scenarioCount, new Scenario(JSON.stringify({
      ...scenarioA,
      category,
      id: this.scenarioCount
    })))

    this.scenarioCount++

    this.scenarios.set(this.scenarioCount, new Scenario(JSON.stringify({
      ...scenarioB,
      category,
      id: this.scenarioCount
    })))

    this.scenarioCount++

    return true
  }

  get(id: string) {
    const scenarioA: Scenario = this.scenarios.get(id)

    if (!scenarioA) {
      throw new Error(`Question with id ${id} not found.`)
    }

    let scenarioB: Scenario

    try {
      do {
        scenarioB = this.scenarios.get(Math.floor(Math.random() * this.scenarioCount))
      }
      while (scenarioB.category !== scenarioA.category || scenarioA.id === scenarioB.id)
    } catch {
    }

    if (!scenarioB)  {
      throw new Error(`Couldn't find matching scenario for scenario with id ${id}.`)
    }

    return new Question(scenarioA, scenarioB)
  }

  getExact(idA: string, idB: string) {
    const scenarioA: Scenario = this.scenarios.get(idA)

    if (!scenarioA) {
      throw new Error(`Question with id ${idA} not found.`)
    }

    const scenarioB: Scenario = this.scenarios.get(idB)

    if (!scenarioB) {
      throw new Error(`Question with id ${idB} not found.`)
    }

    return new Question(scenarioA, scenarioB)
  }

  getAll() {
    if (Blockchain.transaction.from !== this.ownerAddress) {
      throw new Error('Unauthorized')
    }

    const all = []

    for (let i = 0; i < this.scenarioCount; i++) {
      all.push(this.scenarios.get(i))
    }

    return all
  }

  vote(idA: string, idB: string, scenarioA: boolean) {
    if (scenarioA) {
      const scenario: Scenario = this.scenarios.get(idA)

      scenario.votes = scenario.votes.plus(1)

      this.scenarios.set(idA, scenario)
    } else {
      const scenario: Scenario = this.scenarios.get(idB)

      scenario.votes = scenario.votes.plus(1)

      this.scenarios.set(idB, scenario)
    }

    return true
  }

  clear(): boolean {
    if (Blockchain.transaction.from !== this.ownerAddress) {
      throw new Error('Unauthorized')
    }

    for (let i = 0; i < this.scenarioCount; i++) {
      this.scenarios.del(i)
    }

    this.scenarioCount = 0

    return true
  }

  delete(id: string): boolean {
    if (Blockchain.transaction.from !== this.ownerAddress) {
      throw new Error('Unauthorized')
    }

    for (let i = parseInt(id); i < this.scenarioCount - 1; ++i) {
      this.scenarios.set(i, this.scenarios.get(i + 1))
    }

    this.scenarios.del(this.scenarioCount)
    this.scenarioCount--

    return true
  }

  getScenarioCount() {
    return this.scenarioCount
  }

  getOwnerAddress() {
    return this.ownerAddress
  }
}

export = CryptoEitherContract