export type PhysicsMode = 'explain' | 'solver' | 'pyq' | 'mistake' | 'rapid';

const GENERIC_EXPLAIN = (topic: string) => `🚀 Concept
${topic}: Study of physical interactions.

🧩 Real-Life Analogy
Gears: One part moves, pushing another.

🔢 Formula (Step-by-Step)
1. Identify variables.
2. Check balance.
3. Solve.

⚡ Shortcut Trick
Visualize the motion first!

❌ Common Mistake
Ignoring units (cm vs m).

📝 Practice
Question 1: Force=10N, Mass=2kg. a=?
Solution:
a = F/m
a = 10 / 2
a = 5 m/s²

Question 2: Mass=5kg, acc=2. F=?
Solution:
F = m * a
F = 5 * 2
F = 10 N`;

export const getPhysicsStaticContent = (mode: PhysicsMode, topic: string): string | null => {
  const t = topic.toLowerCase();

  if (mode === 'explain') {
    if (t.includes('current') || t.includes('electricity')) {
      return `🚀 Concept
Current Electricity is the study of electrons moving through a conductor (like a wire). 
It results in the flow of energy that powers everything from your phone to your house.

🧩 Real-Life Analogy
Think of it like Water flowing through a pipe:
- The Water itself is the 'Current' (Flow of charges).
- The Pump that pushes the water is the 'Voltage' (Pressure).
- The Narrow parts of the pipe are the 'Resistance' (Obstruction).
- More pressure (V) means more flow (I).
- A narrower pipe (R) means less flow (I).

🔢 Formula (Step-by-Step)
Ohm's Law: V = I × R
1. V = Voltage (Measured in Volts). It is the 'push'.
2. I = Current (Measured in Amperes). It is the 'rate' of flow.
3. R = Resistance (Measured in Ohms Ω). it is the 'opposition'.

Power Formula: P = V × I
1. P = Power (Measured in Watts). How much work is done.
2. Energy = Power × Time. How much electricity you use.

⚡ Shortcut Trick
The "V-I-R Triangle":
- Draw a triangle. Put 'V' at the top.
- Put 'I' and 'R' at the bottom.
- To find V: Cover V, you see I × R.
- To find I: Cover I, you see V / R.
- To find R: Cover R, you see V / I.

❌ Common Mistake
Thinking that a 100W bulb always has 100W power even if the voltage drops.
The power rating (100W) is only at a specific voltage (usually 220V). 
If voltage drops, current drops, so power also drops drastically!

📝 Practice
Question 1: A resistor of 10 Ω is connected to a 20V battery. Find the current.
Detailed Solution:
Step 1: Note down what is given.
V = 20 V
R = 10 Ω
Step 2: Choose the formula.
From V-I-R triangle, I = V / R.
Step 3: Substitute the values.
I = 20 / 10
Step 4: Final calculation with units.
I = 2 A (Amperes)

Question 2: An electric iron has a resistance of 50 Ω. If it flows 4A current, find the voltage.
Detailed Solution:
Step 1: Note what is given.
R = 50 Ω
I = 4 A
Step 2: Use the formula V = I × R.
Step 3: Substitute the values.
V = 4 × 50
Step 4: Calculate.
V = 200 V

Question 3: A bulb of 484 Ω is connected to 220 V. Find its Power.
Detailed Solution:
Step 1: Given R = 484, V = 220.
Step 2: Find Current first (I = V/R).
I = 220 / 484 = 0.45 A
Step 3: Find Power (P = V × I).
P = 220 × 0.45 = 100 W
Shortcut: Use P = V²/R directly!
P = (220 × 220) / 484 = 48400 / 484 = 100 W

Question 4: Two resistors of 5 Ω and 5 Ω are in Series. Find Req.
Solution:
In series, just add them up.
Req = R1 + R2 = 5 + 5 = 10 Ω

Question 5: Two resistors of 10 Ω and 10 Ω are in Parallel. Find Req.
Solution:
In parallel, Req = (R1 × R2) / (R1 + R2)
Req = (10 × 10) / (10 + 10) = 100 / 20 = 5 Ω
Trick: Two identical resistors in parallel always give half the value!`;
    }

    if (t.includes('optics') || t.includes('light')) {
      return `🚀 Concept
Ray Optics explains how light travels in straight lines and changes direction 
when it hits a mirror (Reflection) or passes through a lens (Refraction).

🧩 Real-Life Analogy
Looking at your reflection in a shiny spoon:
- The front (Basin) is like a Concave Mirror (makes things look weird and upside down).
- The back is like a Convex Mirror (makes things look smaller and upright, like a car's side mirror).

🔢 Formula (Step-by-Step)
Mirror Formula: 1/f = 1/v + 1/u
1. u = Distance of the Object (Always negative in solved numericals).
2. v = Distance of the Image.
3. f = Focal length (Positive for Convex, Negative for Concave).

Lens Formula: 1/f = 1/v - 1/u (Notice the minus sign!)

Magnification (m):
- m = -v/u (for Mirrors)
- m = v/u (for Lenses)
- m = Height of image / Height of object

⚡ Shortcut Trick
"Mirror is plus, Lens is minus":
Formula for Mirror has 1/v + 1/u.
Formula for Lens has 1/v - 1/u.
Mag for Mirror has -v/u.
Mag for Lens has +v/u. 
The signs are always opposite for mirror and lens!

❌ Common Mistake
Forgetting the Sign Convention. If you don't put u = -ive, your answer will ALWAYS be wrong.
Remember: All distances are measured from the Pole (Mirror) or Optical Center (Lens).

📝 Practice
Question 1: An object is placed at 20cm from a concave mirror of focal length 10cm. Find image distance.
Detailed Solution:
Step 1: Given u = -20 cm (ALWAYS negative).
Step 2: Concave mirror, so f = -10 cm.
Step 3: Formula 1/f = 1/v + 1/u
1/(-10) = 1/v + 1/(-20)
Step 4: Shift 1/(-20) to the other side.
1/v = -1/10 + 1/20
Step 5: Simplify fractions (LCM = 20).
1/v = (-2 + 1) / 20 = -1 / 20
Step 6: Invert it to find v.
v = -20 cm
Answer: Image is 20cm in front of the mirror (Real and Inverted).

Question 2: A lens has power +2D. Find its focal length.
Detailed Solution:
Step 1: Formula P = 1 / f (in meters) or P = 100 / f (in cm).
Step 2: Given P = +2.
Step 3: 2 = 100 / f
f = 100 / 2 = 50 cm
Answer: 50 cm (Convex Lens).

Question 3: If an object is at infinity, where is the image formed?
Answer: At the Focus (f).

Question 4: A ray hits air-glass interface at 45°. μ of glass = 1.5. Find sin(r).
Solution:
μ = sin(i) / sin(r)
1.5 = sin(45°) / sin(r)
1.5 = 0.707 / sin(r)
sin(r) = 0.707 / 1.5 = 0.47`;
    }

    if (t.includes('motion') || t.includes('newton')) {
      return `🚀 Concept
Newton's Laws describe how forces (pushes and pulls) make objects move, stop, or change speed.
It is the foundation of all classical mechanics.

🧩 Real-Life Analogy
1st Law (Inertia): Why you fall forward when a bus suddenly brakes. Your feet stop with the bus, but your body wants to keep moving at the same speed!
2nd Law (F=ma): Why it's harder to push a heavy truck than a small bicycle. More mass needs more force for the same acceleration.

🔢 Formula (Step-by-Step)
F = m × a
1. F = Force (Newton N)
2. m = Mass (Kilogram kg)
3. a = Acceleration (m/s²)

Momentum (p): p = m × v
1. p = Momentum (kg.m/s)
2. v = Velocity (m/s)

⚡ Shortcut Trick
"LIFT TRICK" for apparent weight:
- If lift goes UP (+a): Weight = m(g + a). You feel heavier.
- If lift goes DOWN (-a): Weight = m(g - a). You feel lighter.
- If it's free-falling: Weight = 0 (Weightlessness).

❌ Common Mistake
Thinking that 'Inertia' is a force. It's not! It's just a property of mass.
Also, forgetting that F in F=ma is the NET force (total push - total pull).

📝 Practice
Question 1: A force of 50N acts on a 5kg mass. Find acceleration.
Detailed Solution:
Step 1: Given F = 50N, m = 5kg.
Step 2: Formula a = F / m.
Step 3: a = 50 / 5
Step 4: a = 10 m/s².

Question 2: A cricketer catches a 150g ball moving at 20m/s in 0.1s. Find force applied by hand.
Detailed Solution:
Step 1: m = 150g = 0.15 kg (Must convert to kg!).
Step 2: Initial v = 20, Final v = 0.
Step 3: Δp (Change in momentum) = m(v - u) = 0.15(0 - 20) = -3 kg.m/s.
Step 4: Force F = Δp / t = -3 / 0.1 = -30 N.
Answer: 30 Newton in opposite direction.

Question 3: A body of 10kg is on a friction-less surface. A force of 20N moves it for 2s. Distance covered?
Solution:
Step 1: a = F/m = 20/10 = 2 m/s².
Step 2: s = ut + ½at² (u=0).
s = 0 + ½(2)(2²) = 4 meters.

Question 4: Find tension in a string pulling 2kg block up with a=2m/s².
Solution:
T - mg = ma => T = m(g + a)
T = 2(10 + 2) = 24 Newton.`;
    }

    if (t.includes('units') || t.includes('measurement')) {
        return `🚀 Concept
Units and Measurements is the language of Physics. It involves standardizing how we 
measure mass, length, time, and other quantities so that science is consistent globally.

🧩 Real-Life Analogy
Ordering a pizza:
- If you say "I want 2 pizza," it's confusing.
- If you say "I want 2 large 12-inch pizzas," it's precise.
The '12-inch' is the unit that gives meaning to the number '2'.

🔢 Formula (Step-by-Step)
Dimensional Formula: [M^a L^b T^c]
1. M = Mass (kg)
2. L = Length (m)
3. T = Time (s)

Error Analysis:
Relative Error = ΔA / A
Percentage Error = (ΔA / A) × 100

⚡ Shortcut Trick
"The Principle of Homogeneity":
In any equation like A = B + C, the dimensions of A, B, and C MUST be exactly the same.
You can't add 5 kg of sugar to 2 meters of cloth! 
NEET Trick: Use this to check if a formula in the options is even possible.

❌ Common Mistake
Confusing 'Significant Figures' during addition vs multiplication.
- Addition: Look at decimal places.
- Multiplication: Look at total significant figures.

📝 Practice
Question 1: Find the dimensions of Gravitational Constant 'G'.
Detailed Solution:
Step 1: Formula F = G m1 m2 / r².
Step 2: Rearrange for G: G = F r² / (m1 m2).
Step 3: Dimensions of F = [MLT⁻²].
Step 4: Dimensions of r² = [L²].
Step 5: Dimensions of m1 m2 = [M²].
Step 6: Combine: [MLT⁻²] [L²] / [M²] = [M⁻¹ L³ T⁻²].
Final Result: [M⁻¹ L³ T⁻²].

Question 2: The radius of a sphere is measured with 2% error. Find % error in Volume.
Detailed Solution:
Step 1: Volume V = (4/3) π r³.
Step 2: In error math, constants (4/3, π) are ignored.
Step 3: Power rule: % error in V = 3 × (% error in r).
Step 4: % error in V = 3 × 2% = 6%.
Final Result: 6%.

Question 3: If Force (F), Velocity (V), and Time (T) are fundamental units, find dimensions of Mass.
Solution:
Step 1: F = m × a = m × (V/T).
Step 2: Solve for m: m = F × T / V.
Step 3: m = [F T V⁻¹].

Question 4: Add 12.11 and 18.0 using significant figures.
Solution:
12.11 (2 decimal places) + 18.0 (1 decimal place).
Sum = 30.11.
Rounding to 1 decimal place = 30.1.

Question 5: How many nanometers are in 1 kilometer?
Detailed Solution:
1 km = 10³ m.
1 m = 10⁹ nm.
1 km = 10³ × 10⁹ = 10¹² nm.`;
    }

    if (t.includes('modern physics') || t.includes('atoms')) {
        return `🚀 Concept
Modern Physics deals with the world of the very small (Atoms, Nuclei) and 
the very fast (Photons). It proves that light behaves as both a wave and a particle.

🧩 Real-Life Analogy
The "Solar Cell" on a calculator:
Light hits the cell, and its 'packets of energy' (Photons) knock electrons loose, 
creating electricity. This is the Photoelectric Effect!

🔢 Formula (Step-by-Step)
Photoelectric Equation: K_max = hν - Φ
1. K_max = Maximum Kinetic Energy of ejected electron.
2. hν = Energy of incident photon (h = Planck's constant).
3. Φ = Work Function (Minimum energy needed to knock an electron out).

De-Broglie Wavelength: λ = h / p = h / (mv)
1. λ = Wavelength of a moving particle.
2. p = Momentum.

⚡ Shortcut Trick
For NEET numericals, use: Energy (in eV) = 12400 / λ (in Å)
Instead of using h=6.6e-34 and c=3e8 which takes minutes to calculate, 
this 12400 trick solves it in 5 seconds!

❌ Common Mistake
Thinking that increasing the INTENSITY of light increases the ENERGY of electrons.
- Intensity = More photons (More electrons, but SAME energy).
- Frequency = More energy per photon (FASTER electrons).

📝 Practice
Question 1: Find the energy of a photon of wavelength 4000 Å in eV.
Detailed Solution:
Step 1: Use the shortcut E = 12400 / λ.
Step 2: E = 12400 / 4000.
Step 3: E = 12.4 / 4 = 3.1 eV.
Final Result: 3.1 eV. (So much faster than standard calc!)

Question 2: If work function is 2eV and incident energy is 5eV, find K_max.
Detailed Solution:
Step 1: K_max = Energy - Work Function.
Step 2: K_max = 5eV - 2eV = 3eV.
Final Result: 3eV.

Question 3: Find the ratio of radii of 2nd and 1st orbits of Hydrogen atom.
Detailed Solution:
Step 1: Formula r_n ∝ n².
Step 2: r2 / r1 = (2 / 1)² = 4.
Final Result: 4:1.

Question 4: What happens to de-Broglie wavelength if velocity is doubled?
Detailed Solution:
Step 1: λ = h / mv.
Step 2: λ is inversely proportional to v.
Step 3: If v is doubled, λ becomes Half (λ/2).

Question 5: A radioactive sample has half-life of 10 days. How much remains after 30 days?
Detailed Solution:
Step 1: 30 days = 3 half-lives.
Step 2: Amount remains = (1/2)³ of initial.
Step 3: (1/2)³ = 1/8 = 12.5%.`;
    }

    return GENERIC_EXPLAIN(topic);
  }

  // Maintaining other modes as they were but with minor cleanup
  if (mode === 'pyq') {
    if (t.includes('optics')) {
      return `🎯 PYQ Pattern Mode
Topic: Ray Optics

1. Pattern: Silvering of Lens
   Concept: A lens silvered on one side behaves like a mirror.
   Shortcut: Power(effective) = 2 × Power(lens) + Power(mirror).
   Example: Biconvex lens (f=10) silvered on one side becomes a concave mirror.

2. Pattern: Prism Minimum Deviation
   Concept: When ray passes symmetrically through prism.
   Shortcut: angle i = angle e AND angle r1 = angle r2 = A/2.
   Example: If A=60° and μ=√2, find min deviation angle.

3. Pattern: Combination of Lenses
   Shortcut: 1/f = 1/f1 + 1/f2. Power = P1 + P2.
   Tip: If one lens is convex (+) and other concave (-), the combination can be diverging or converging depending on which 'P' is bigger.`;
    }
  }

  if (mode === 'solver') {
    if (t.includes('accelerates uniformly') || t.includes('v=u+at')) {
      return `⚡ Step-by-Step Solver
Topic: Uniform Acceleration

🔢 Formula
v = u + at
s = ut + ½at²
v² = u² + 2as

🛠️ Solution (u=0, v=20, t=10)
Given:
Initial velocity (u) = 0 m/s
Final velocity (v) = 20 m/s
Time (t) = 10 s

Step 1: Find Acceleration (a)
Using v = u + at
20 = 0 + a × 10
20 = 10a
a = 20 / 10 = 2 m/s²

Step 2: Find Distance (s)
Using s = ut + ½at²
s = (0 × 10) + ½ × 2 × (10 × 10)
s = 0 + 1 × 100
s = 100 meters

✅ Final Result: a = 2 m/s², s = 100 m.

⚠️ Mistake Alert
Check if speed is in km/h or m/s. 
If km/h, multiply by 5/18 to get m/s!`;
    }
  }

  return null;
};
