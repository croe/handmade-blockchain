import { createHash } from 'crypto';

// 単語リストの定義
const adjectives = [
  "Acidic", "Ancient", "Azure", "Black", "Blue", "Bold", "Brave", "Bright", "Bronze", "Calm",
  "Clever", "Cloudy", "Cold", "Cool", "Crimson", "Crystal", "Dark", "Dawn", "Deep", "Desert",
  "Digital", "Dusty", "Emerald", "Empty", "Eternal", "Fast", "Fiery", "First", "Flying", "Forest",
  "Frozen", "Gentle", "Glass", "Golden", "Grand", "Green", "Grey", "Hidden", "High", "Hollow",
  "Huge", "Icy", "Iron", "Jade", "Keen", "Last", "Late", "Lazy", "Light", "Little",
  "Lively", "Lone", "Long", "Lost", "Loud", "Low", "Magic", "Majestic", "Marble", "Master",
  "Merry", "Midnight", "Misty", "Moon", "Mystic", "Noble", "Old", "Orange", "Outer", "Pearl",
  "Phantom", "Pink", "Plain", "Prime", "Proud", "Purple", "Quiet", "Rapid", "Rare", "Red",
  "Regal", "Rocky", "Royal", "Ruby", "Rusty", "Sacred", "Sapphire", "Scarlet", "Secret", "Shadow",
  "Shining", "Silent", "Silver", "Sky", "Slow", "Small", "Smooth", "Snowy", "Solar", "Solid",
  "Solitary", "Sonic", "Sorrows", "Spirit", "Spring", "Still", "Stone", "Storm", "Stray", "Strong",
  "Summer", "Sun", "Swift", "Thunder", "Time", "Titan", "Twilight", "Vast", "Velvet", "Venom",
  "Violet", "Void", "Wandering", "Warm", "Water", "White", "Wild", "Windy", "Winter", "Wise",
  "Yellow", "Young", "Zealous", "Zenith"
];

const animals = [
  "Alpaca", "Ant", "Antelope", "Ape", "Badger", "Bat", "Bear", "Beaver", "Bee", "Beetle",
  "Bird", "Bison", "Boar", "Buffalo", "Butterfly", "Camel", "Capybara", "Caribou", "Cat", "Caterpillar",
  "Cheetah", "Chicken", "Chimp", "Clam", "Cobra", "Cod", "Condor", "Cougar", "Cow", "Coyote",
  "Crab", "Crane", "Cricket", "Crocodile", "Crow", "Deer", "Dingo", "Dog", "Dolphin", "Donkey",
  "Dove", "Dragon", "Dragonfly", "Duck", "Eagle", "Eel", "Elephant", "Elk", "Emu", "Falcon",
  "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog", "Gazelle", "Gecko", "Gerbil",
  "Gibbon", "Giraffe", "Goat", "Goose", "Gopher", "Gorilla", "Grasshopper", "Grouse", "Gull", "Hamster",
  "Hare", "Hawk", "Hedgehog", "Heron", "Hippo", "Hornet", "Horse", "Hound", "Hummingbird", "Hyena",
  "Ibis", "Jackal", "Jaguar", "Jellyfish", "Kangaroo", "Kingfisher", "Koala", "Koi", "Komodo", "Kudu",
  "Ladybug", "Lamb", "Lark", "Lemming", "Lemur", "Leopard", "Liger", "Lion", "Lizard", "Llama",
  "Lobster", "Lynx", "Macaw", "Magpie", "Mallard", "Manatee", "Mantis", "Marmot", "Meerkat", "Mink",
  "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Moth", "Mouse", "Mule", "Muskrat", "Newt",
  "Nightingale", "Octopus", "Okapi", "Opossum", "Orangutan", "Ostrich", "Otter", "Owl", "Ox", "Oyster",
  "Panda", "Panther", "Parrot", "Partridge", "Peacock", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon",
  "Piranha", "Platypus", "Polecat", "Pony", "Porcupine", "Possum", "Puffin", "Puma", "Quail", "Rabbit",
  "Raccoon", "Ram", "Rat", "Raven", "Reindeer", "Rhino", "Robin", "Rook", "Salamander", "Salmon",
  "Sandpiper", "Sardine", "Scorpion", "Seagull", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Shrimp",
  "Skunk", "Sloth", "Snail", "Snake", "Sparrow", "Spider", "Sponge", "Squid", "Squirrel", "Starfish",
  "Stingray", "Stork", "Swallow", "Swan", "Tapir", "Termite", "Tiger", "Toad", "Toucan", "Trout",
  "Turkey", "Turtle", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Weasel", "Whale", "Wildcat",
  "Wolf", "Wolverine", "Wombat", "Woodpecker", "Worm", "Wren", "Yak", "Zebra"
];

const nouns = [
  "Anchor", "Angel", "Apple", "Arc", "Arrow", "Autumn", "Axe", "Badge", "Balcony", "Ball",
  "Banner", "Beacon", "Beard", "Beast", "Bell", "Belt", "Blade", "Blaze", "Bloom", "Boat",
  "Bolt", "Bomb", "Bone", "Book", "Boot", "Boulder", "Bow", "Box", "Branch", "Bread",
  "Breath", "Bridge", "Brook", "Broom", "Brush", "Bubble", "Buckle", "Bugle", "Bulb", "Bullet",
  "Bush", "Cabin", "Cable", "Cake", "Call", "Camp", "Candle", "Cane", "Cannon", "Canyon",
  "Cape", "Card", "Carpet", "Carriage", "Cart", "Cascade", "Castle", "Cave", "Chain", "Chalice",
  "Chamber", "Charm", "Chasm", "Chest", "Chime", "Circle", "City", "Claw", "Cliff", "Cloak",
  "Clock", "Cloud", "Club", "Coal", "Coast", "Code", "Coil", "Coin", "Comet", "Compass",
  "Cone", "Core", "Corner", "Corpse", "Cosmos", "Cottage", "Court", "Cove", "Crag", "Crater",
  "Creek", "Crest", "Crier", "Cross", "Crown", "Crumb", "Crush", "Crypt", "Crystal", "Cube",
  "Cup", "Curse", "Curtain", "Cushion", "Dagger", "Dance", "Dawn", "Day", "Delta", "Demon",
  "Desert", "Dew", "Dice", "Disc", "Diver", "Domain", "Donkey", "Door", "Dove", "Dragon",
  "Drain", "Drake", "Dream", "Dress", "Drift", "Drill", "Drink", "Drive", "Drop", "Drum",
  "Dusk", "Dust", "Dwarf", "Dwelling", "Eagle", "Earth", "Echo", "Eddy", "Edge", "Eel",
  "Egg", "Elder", "Elixir", "Elm", "Ember", "Enchant", "Engine", "Envoy", "Epic", "Essence",
  "Evening", "Eye", "Fabric", "Face", "Fall", "Fang", "Farm", "Feast", "Feather", "Fence",
  "Fern", "Field", "Figure", "Finger", "Fire", "Fish", "Fist", "Flag", "Flame", "Flask",
  "Fleet", "Flesh", "Flight", "Flint", "Flood", "Flower", "Flute", "Fly", "Foam", "Fog",
  "Folk", "Food", "Foot", "Force", "Forest", "Forge", "Fork", "Form", "Fort", "Fossil",
  "Fountain", "Fox", "Frame", "Frenzy", "Frost", "Fruit", "Fungus", "Furnace", "Fury", "Gale",
  "Game", "Garden", "Garland", "Gas", "Gate", "Gauntlet", "Gear", "Gem", "Genie", "Ghost",
  "Giant", "Gift", "Glacier", "Glade", "Glance", "Glass", "Gaze", "Glider", "Glimmer", "Globe",
  "Gloom", "Glove", "Glow", "Gnome", "Goat", "Goblet", "God", "Gold", "Golem", "Gong",
  "Grace", "Grain", "Grape", "Grass", "Grave", "Greed", "Griffin", "Grimoire", "Grip", "Grove",
  "Guard", "Guest", "Guide", "Gulf", "Gum", "Gust", "Hail", "Hair", "Hall", "Hammer",
  "Hand", "Hanger", "Harbor", "Harp", "Harpoon", "Harvest", "Hat", "Hatch", "Haven", "Hawk",
  "Hay", "Haze", "Head", "Health", "Heart", "Hearth", "Heat", "Heaven", "Hedge", "Heel",
  "Heir", "Helm", "Herb", "Herd", "Hermit", "Hero", "Hex", "Hide", "Hill", "Hilt",
  "Hive", "Hole", "Home", "Honey", "Hood", "Hoof", "Hook", "Hope", "Horn", "Horse",
  "Host", "Hour", "House", "Hulk", "Hum", "Hunt", "Hut", "Ice", "Icon", "Idol",
  "Inferno", "Ingot", "Ink", "Inn", "Insect", "Instrument", "Iron", "Island", "Ivory", "Jackal",
  "Jail", "Jar", "Jaw", "Jelly", "Jest", "Jet", "Jewel", "Jinn", "Journey", "Joy",
  "Judge", "Jug", "Juice", "Jungle", "Keep", "Keg", "Key", "Kindred", "King", "Kite",
  "Kitten", "Knife", "Knight", "Knot", "Knowledge", "Kraken", "Labor", "Lace", "Ladder", "Lady",
  "Lagoon", "Lair", "Lake", "Lamb", "Lament", "Lamp", "Lance", "Land", "Lantern", "Lark",
  "Lash", "Lava", "Law", "Leaf", "League", "Leather", "Legacy", "Legend", "Lens", "Letter",
  "Lever", "Liar", "Lichen", "Life", "Light", "Lightning", "Lily", "Limb", "Line", "Link",
  "Lion", "Lip", "Liquid", "Lizard", "Loaf", "Lock", "Locket", "Lodge", "Log", "Loom",
  "Loop", "Lord", "Lore", "Lotus", "Luck", "Lumber", "Lure", "Lute", "Lyre", "Machine",
  "Madness", "Mage", "Magic", "Magma", "Magnet", "Maiden", "Mail", "Mammoth", "Man", "Mane",
  "Mansion", "Mantle", "Map", "Marble", "March", "Mare", "Mark", "Market", "Marsh", "Mask",
  "Mast", "Match", "Maze", "Meadow", "Meal", "Medal", "Melody", "Memory", "Menace", "Merchant",
  "Message", "Metal", "Meteor", "Might", "Milk", "Mill", "Mind", "Mine", "Mint", "Mirror",
  "Mist", "Moat", "Mole", "Monarch", "Monk", "Monster", "Monument", "Moon", "Morning", "Moss",
  "Moth", "Motion", "Mount", "Mountain", "Mouse", "Mouth", "Mud", "Mug", "Mule", "Muse",
  "Mushroom", "Music", "Mystery", "Myth", "Naga", "Nail", "Name", "Nature", "Navigator", "Necklace",
  "Needle", "Nest", "Net", "Nexus", "Night", "Nimbus", "Noble", "Nomad", "Noon", "Noodle",
  "Nook", "North", "Nose", "Note", "Nothing", "Nova", "Nucleus", "Nugget", "Nut", "Nymph",
  "Oak", "Oar", "Oasis", "Oath", "Obelisk", "Ocean", "Ochre", "Octopus", "Odor", "Ogre",
  "Oil", "Ointment", "Omen", "Oracle", "Orb", "Orchard", "Ore", "Organ", "Origin", "Ornament",
  "Outpost", "Owl", "Ox", "Oyster", "Pact", "Pad", "Page", "Pain", "Paint", "Palace",
  "Palm", "Pan", "Panda", "Panel", "Pansy", "Pantheon", "Panther", "Pants", "Paper", "Parade",
  "Paradise", "Parchment", "Park", "Parrot", "Part", "Pass", "Passion", "Past", "Pasture", "Patch",
  "Path", "Pattern", "Pawn", "Peace", "Peach", "Peak", "Peanut", "Pear", "Pearl", "Pebble",
  "Pegasus", "Pen", "Pendant", "Pendulum", "Pennant", "People", "Pepper", "Perfume", "Peril", "Petal",
  "Phantom", "Phoenix", "Phrase", "Pick", "Picture", "Pie", "Piece", "Pig", "Pike", "Pilgrim",
  "Pillar", "Pillow", "Pin", "Pine", "Pioneer", "Pipe", "Pirate", "Pit", "Pitch", "Pixie",
  "Plague", "Plain", "Plan", "Plane", "Plank", "Plant", "Plate", "Plaza", "Pledge", "Plight",
  "Plot", "Plough", "Plume", "Pocket", "Pod", "Poem", "Poet", "Point", "Poison", "Poker",
  "Pole", "Pollen", "Pond", "Pony", "Pool", "Poppy", "Porch", "Portal", "Portent", "Post",
  "Pot", "Potion", "Pouch", "Powder", "Power", "Prayer", "Presence", "Present", "Prey", "Price",
  "Pride", "Priest", "Prince", "Prison", "Prize", "Probe", "Procession", "Prodigy", "Promise", "Prophecy",
  "Prospect", "Prow", "Puddle", "Puff", "Pulp", "Pulse", "Pump", "Pumpkin", "Punch", "Punishment",
  "Pup", "Puppet", "Purple", "Purse", "Puzzle", "Pyramid", "Quake", "Quarry", "Queen", "Quest",
  "Quill", "Quiver", "Rabbit", "Race", "Raft", "Rage", "Rail", "Rain", "Rainbow", "Ram",
  "Rampart", "Ranger", "Rapier", "Rat", "Rattle", "Raven", "Ray", "Realm", "Reaper", "Reason",
  "Rebel", "Record", "Red", "Reed", "Reef", "Reflection", "Refuge", "Reign", "Relic", "Remedy",
  "Report", "Reptile", "Requiem", "Rescue", "Reserve", "Resin", "Rest", "Retreat", "Return", "Revelation",
  "Revenge", "Reward", "Rhythm", "Ribbon", "Riddle", "Ridge", "Rifle", "Rift", "Right", "Rim",
  "Ring", "Riot", "Rip", "Ripple", "Rise", "Risk", "Rite", "Ritual", "River", "Road",
  "Roar", "Robe", "Robin", "Rock", "Rod", "Rogue", "Roll", "Romance", "Roof", "Rook",
  "Room", "Root", "Rope", "Rose", "Rot", "Round", "Route", "Ruby", "Ruin", "Rule",
  "Rune", "Runner", "Rust", "Saber", "Sack", "Sacrifice", "Saddle", "Sage", "Sail", "Saint",
  "Salad", "Salamander", "Salt", "Salute", "Sanctuary", "Sand", "Sandal", "Sap", "Sapphire", "Sarcophagus",
  "Sash", "Satellite", "Satyr", "Sauce", "Savage", "Scale", "Scarab", "Scar", "Scent", "Scepter",
  "Scheme", "School", "Science", "Scissors", "Scold", "Scoop", "Scorpion", "Scourge", "Scout", "Scrap",
  "Scream", "Screen", "Screw", "Scribe", "Script", "Scroll", "Sculpture", "Scythe", "Sea", "Seal",
  "Seam", "Search", "Season", "Seat", "Secret", "Sect", "Seed", "Seeker", "Segment", "Seer",
  "Self", "Sense", "Sentinel", "Sepulcher", "Serpent", "Servant", "Service", "Session", "Set", "Settlement",
  "Sever", "Shack", "Shackle", "Shade", "Shadow", "Shaft", "Shale", "Shaman", "Shame", "Shard",
  "Shark", "Sheath", "Shed", "Sheep", "Sheet", "Shelf", "Shell", "Shelter", "Shepherd", "Shield",
  "Shift", "Shilling", "Shine", "Ship", "Shiver", "Shoal", "Shock", "Shoe", "Shop", "Shore",
  "Shot", "Shoulder", "Shout", "Shovel", "Show", "Shower", "Shred", "Shriek", "Shrine", "Shroud",
  "Shrub", "Shudder", "Shuttle", "Sickle", "Side", "Siege", "Sigh", "Sight", "Sign", "Signal",
  "Silence", "Silk", "Silver", "Simian", "Sin", "Singer", "Siren", "Sister", "Site", "Skeleton",
  "Skill", "Skin", "Skull", "Sky", "Slab", "Slag", "Slate", "Slave", "Sled", "Sleep",
  "Sleeve", "Slide", "Slime", "Sling", "Slip", "Slipper", "Slit", "Sliver", "Slope", "Sloth",
  "Slough", "Slug", "Slumber", "Smile", "Smoke", "Snake", "Snare", "Snarl", "Sneer", "Snow",
  "Snout", "Socket", "Soil", "Soldier", "Solitude", "Song", "Soot", "Sorcerer", "Sorrow", "Soul",
  "Sound", "Soup", "South", "Sow", "Space", "Spade", "Spaghetti", "Span", "Spark", "Sparrow",
  "Spatula", "Spawn", "Spear", "Specter", "Spell", "Sphere", "Spice", "Spider", "Spike", "Spill",
  "Spin", "Spindle", "Spine", "Spiral", "Spire", "Spirit", "Spit", "Spite", "Splash", "Splinter",
  "Spoke", "Sponge", "Spool", "Spoon", "Spore", "Sport", "Spot", "Spout", "Spray", "Spring",
  "Sprite", "Sprout", "Spur", "Spy", "Square", "Squash", "Squid", "Squirrel", "Stability", "Stack",
  "Staff", "Stage", "Stain", "Stair", "Stake", "Stalk", "Stall", "Stamp", "Stance", "Stand",
  "Star", "Stare", "Statue", "Stave", "Steak", "Steal", "Steam", "Steed", "Steel", "Stem",
  "Step", "Stereo", "Stew", "Stick", "Stigma", "Stiletto", "Still", "Sting", "Stir", "Stitch",
  "Stock", "Stone", "Stool", "Stop", "Storage", "Store", "Storm", "Story", "Stove", "Strait",
  "Strand", "Strap", "Straw", "Streak", "Stream", "Street", "Strength", "Stress", "Strife", "Strike",
  "String", "Strip", "Stripe", "Stroke", "Structure", "Struggle", "Stub", "Stud", "Study", "Stuff",
  "Stump", "Stun", "Style", "Subject", "Success", "Sugar", "Suit", "Sulfur", "Summer", "Summit",
  "Sun", "Supplication", "Supply", "Surface", "Surge", "Surprise", "Swamp", "Swan", "Swarm", "Swath",
  "Sway", "Sweat", "Sweep", "Sweet", "Swell", "Swift", "Swim", "Swing", "Switch", "Swoop",
  "Sword", "Symbol", "Symphony", "Syrup", "System", "Table", "Tablet", "Tack", "Tackle", "Tactics",
  "Tail", "Tale", "Talisman", "Talk", "Talon", "Tambourine", "Tank", "Tape", "Tapestry", "Target",
  "Task", "Tassel", "Taste", "Tattoo", "Tavern", "Tea", "Tear", "Technique", "Temple", "Temptation",
  "Tendril", "Tent", "Tentacle", "Termite", "Terror", "Test", "Tether", "Text", "Texture", "Thicket",
  "Thief", "Thigh", "Thing", "Thirst", "Thistle", "Thorn", "Thought", "Thread", "Threat", "Threshold",
  "Throat", "Throne", "Throng", "Throw", "Thrust", "Thumb", "Thunder", "Tick", "Ticket", "Tide",
  "Tiger", "Tile", "Timber", "Time", "Tinder", "Tinkerer", "Tip", "Tire", "Titan", "Title",
  "Toad", "Toast", "Token", "Tomb", "Tome", "Tongue", "Tool", "Tooth", "Top", "Topaz",
  "Torch", "Torrent", "Tortoise", "Totem", "Touch", "Tour", "Toward", "Tower", "Town", "Toy",
  "Trace", "Track", "Trade", "Tradition", "Tragedy", "Trail", "Train", "Trait", "Traitor", "Trance",
  "Trap", "Travel", "Tread", "Treasure", "Treaty", "Tree", "Trellis", "Tremor", "Trench", "Trial",
  "Triangle", "Tribe", "Tribute", "Trick", "Trident", "Trifle", "Trigger", "Trinket", "Trip", "Triumph",
  "Troll", "Troop", "Trophy", "Trouble", "Trough", "Trout", "Truce", "Trumpet", "Trunk", "Trust",
  "Truth", "Try", "Tube", "Tuber", "Tuft", "Tulip", "Tumble", "Tumor", "Tundra", "Tune",
  "Tunic", "Tunnel", "Turbine", "Turf", "Turn", "Turret", "Turtle", "Tusk", "Twig", "Twilight",
  "Twine", "Twist", "Typhoon", "Tyrant", "Ulcer", "Umbrella", "Underworld", "Unicorn", "Uniform", "Union",
  "Unit", "Universe", "Urchin", "Urn", "Vacuum", "Vale", "Valley", "Valor", "Vampire", "Van",
  "Vane", "Vanguard", "Vapor", "Vase", "Vault", "Vegetable", "Veil", "Vein", "Velvet", "Vendetta",
  "Venom", "Vent", "Venture", "Verdict", "Verse", "Vessel", "Vest", "Veteran", "Vial", "Vibration",
  "Victor", "Victory", "View", "Vigil", "Village", "Vine", "Vinegar", "Violence", "Violet", "Viper",
  "Virgin", "Virtue", "Virus", "Vision", "Visit", "Vista", "Voice", "Void", "Volcano", "Volume",
  "Vortex", "Vote", "Vow", "Voyage", "Vulture", "Wager", "Wagon", "Waif", "Wail", "Wait",
  "Wake", "Walk", "Wall", "Wallet", "Walrus", "Wand", "War", "Ward", "Warden", "Warehouse",
  "Warlock", "Warmth", "Warning", "Warp", "Warrior", "Wart", "Wash", "Wasp", "Waste", "Watch",
  "Water", "Wave", "Wax", "Way", "Weakness", "Wealth", "Weapon", "Weasel", "Weather", "Web",
  "Weed", "Week", "Weight", "Weird", "Well", "West", "Whale", "Wheat", "Wheel", "Whelp",
  "Whip", "Whirl", "Whisper", "Whistle", "White", "Wick", "Widget", "Widow", "Wife", "Wild",
  "Wilderness", "Will", "Willow", "Wimp", "Win", "Wind", "Window", "Wine", "Wing", "Wink",
  "Winner", "Winter", "Wire", "Wisdom", "Wish", "Wit", "Witch", "Witness", "Wizard", "Woe",
  "Wolf", "Woman", "Womb", "Wonder", "Wood", "Wool", "Word", "Work", "World", "Worm",
  "Worry", "Worship", "Wound", "Wrack", "Wrath", "Wreath", "Wreck", "Wrench", "Wrestler", "Wretch",
  "Wrist", "Writer", "Wrong", "Wyrm", "Xylophone", "Yacht", "Yak", "Yam", "Yard", "Yarn",
  "Year", "Yeast", "Yellow", "Yelp", "Yeti", "Yew", "Yield", "Yoke", "Yolk", "Youth",
  "Zealot", "Zenith", "Zephyr", "Zero", "Zest", "Zigzag", "Zinc", "Zombie", "Zone", "Zoo"
];


/**
 * 文字列IDから決定論的に3つの単語を選び、結合して人間が読みやすい文字列を生成するのだ。
 * IDをSHA256でハッシュ化し、そのハッシュ値を基に各単語リストから単語を選択するのだ。
 *
 * @param id 対象のID文字列なのだ
 * @returns "形容詞 動物 名詞" の形式で結合された文字列なのだ
 */
export function generateReadableId(id: string): string {
  if (!id) {
    return "Unknown Being"; // IDが空の場合のデフォルト値なのだ
  }

  const hash = createHash('sha256').update(id).digest('hex');

  // ハッシュ値を3つの部分に分割して、それぞれの単語リストのインデックスとして使用するのだ
  // ハッシュの長さに応じて分割点を調整するのだ
  const hashLength = hash.length;
  const partLength = Math.floor(hashLength / 3);

  const index1 = parseInt(hash.substring(0, partLength), 16) % adjectives.length;
  const index2 = parseInt(hash.substring(partLength, 2 * partLength), 16) % animals.length;
  const index3 = parseInt(hash.substring(2 * partLength), 16) % nouns.length;

  const adjective = adjectives[index1];
  const animal = animals[index2];
  const noun = nouns[index3];

  return `${adjective} ${animal} ${noun}`;
}

/**
 * この関数は、与えられたID文字列から人間が読みやすいユニークな名前を生成することを目的としているのだ。
 * 例えば、'user123'というIDから'Clever Fox Mountain'のような名前を生成するのだ。
 *
 * 生成ロジック：
 * 1. 入力IDをSHA256でハッシュ化し、16進文字列を得るのだ。
 * 2. ハッシュ文字列を3つのほぼ等しい部分に分割するのだ。
 * 3. 各部分文字列を16進数として解釈し、それぞれの単語リスト（形容詞、動物、名詞）のサイズで剰余を取り、インデックスを計算するのだ。
 * 4. 計算されたインデックスを使用して、各リストから単語を選択するのだ。
 * 5. 選択された3つの単語をスペースで結合して、最終的な読みやすい名前を生成するのだ。
 *
 * これにより、同じIDからは常に同じ名前が生成され、異なるIDからは高い確率で異なる名前が生成されることが期待されるのだ。
 * 単語リストの選定やハッシュ化アルゴリズムは、必要に応じて調整可能なのだ。
 */

const AVATAR_COUNT = 6;
const AVATAR_PATH_PREFIX = "/images/icons/icon_avatar_";
const AVATAR_DEFAULT_ICON = `${AVATAR_PATH_PREFIX}1.png`;

/**
 * 文字列IDから決定論的にアバター画像のパスを生成するのだ。
 * IDをSHA256でハッシュ化し、そのハッシュ値を基にアバターを選択するのだ。
 *
 * @param id 対象のID文字列なのだ
 * @returns アバター画像のパス文字列なのだ。例: "assets/images/icons/icon_avatar_3.png"
 */
export function getAvatarForId(id: string): string {
  if (!id) {
    return AVATAR_DEFAULT_ICON; // IDが空の場合のデフォルトアイコンなのだ
  }

  try {
    const hash = createHash('sha256').update(id).digest('hex');
    // ハッシュ値全体を数値として解釈し、アバターの数で剰余を取るのだ。
    // ハッシュ値が非常に大きい場合があるので、先頭16文字（64ビット相当）を使うことで、
    // 巨大な数値のパースエラーを防ぎつつ、十分なランダム性を確保するのだ。
    const numericHashPart = parseInt(hash.substring(0, 16), 16);
    const avatarIndex = (numericHashPart % AVATAR_COUNT) + 1; // 1からAVATAR_COUNTまでの数値を得るのだ

    return `${AVATAR_PATH_PREFIX}${avatarIndex}.png`;
  } catch (error) {
    console.error("Error generating avatar path for ID:", id, error);
    return AVATAR_DEFAULT_ICON; // エラー発生時もデフォルトアイコンを返すのだ
  }
}

/**
 * この関数は、与えられたID文字列に基づいて、事前に用意された複数のアバター画像の中から
 * 決定論的に1つを選択し、その画像のパスを返すことを目的としているのだ。
 *
 * 生成ロジック：
 * 1. 入力IDをSHA256でハッシュ化し、16進文字列を得るのだ。
 * 2. ハッシュ文字列の先頭部分を16進数として解釈するのだ。
 * 3. 解釈した数値をアバター画像の総数で割り、その剰余を計算するのだ。
 * 4. 剰余に1を足して、1から始まるアバター画像のインデックス（例: 1, 2, ..., 6）を決定するのだ。
 * 5. ベースパス、決定したインデックス、拡張子を組み合わせて、最終的な画像パス文字列（例: "assets/images/icons/icon_avatar_3.png"）を生成するのだ。
 *
 * これにより、同じIDからは常に同じアバター画像が選択され、異なるIDからは均等に異なるアバター画像が選択されることが期待されるのだ。
 * IDが空文字列の場合や、処理中に何らかのエラーが発生した場合は、デフォルトのアバター画像パスが返されるのだ。
 * アバター画像の総数は `AVATAR_COUNT` 定数で定義されているのだ。
 */
