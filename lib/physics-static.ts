export type PhysicsMode = 'explain' | 'solver' | 'pyq' | 'mistake' | 'rapid';

const GENERIC_EXPLAIN = (topic: string) => `🧩 Explain Simply: ${topic}

Think of ${topic} in simple real-world terms. Here is a bite-sized breakdown:

1. The Analogy:
Imagine water flowing through pipes or cars navigating through traffic. The core principle of ${topic} can be understood as how different elements interact under specific conditions.

2. The Core Concept:
At its heart, this topic is about cause and effect. When you change one variable, another responds predictably.

3. Golden Rule:
Always remember that energy and mass are conserved. What goes into the system must be accounted for!

📋 Key Takeaways:
• Always check your units.
• Start by drawing a rough diagram.
• Break complex problems into smaller parts.`;

export const getPhysicsStaticContent = (mode: PhysicsMode, topic: string): string | null => {
  const topicLower = topic.toLowerCase();

  if (mode === 'explain') {
    if (topicLower.includes('current') || topicLower.includes('electricity')) {
      return `🧩 Explain Simply: Current Electricity

Think of electricity like water flowing through pipes:
1. The Voltage (V): Think of this as the Water Pressure. It's the "push" that makes the water move.
2. The Current (I): This is the Water Flow rate. How much water is actually passing through the pipe.
3. The Resistance (R): This is like a Narrow Pipe or a Clogged Section. It resists the flow of water.

Ohm's Law (V = IR) basically says: To get more flow (I) through a narrow pipe (R), you need more pressure (V)!

📋 Key Exam Trap:
Resistance depends ONLY on the material and dimensions (Length, Area), NOT on the Voltage or Current applied. Don't fall for the V/I trap!`;
    }

    if (topicLower.includes('optics') || topicLower.includes('light')) {
      return `🧩 Explain Simply: Ray Optics

Think of light as tiny, super-fast Arrows that always travel in perfectly straight lines until they hit something.
1. Reflection: The arrow bounces off a shield (Mirror) at the exact same angle it hit.
2. Refraction: The arrow enters a "Thick Mud" (Glass/Water). It slows down and deviates from its path. 
3. Converging Lens: Like a "Funnel" that collects parallel arrows and brings them to one point (Focus).

📋 Golden Rule:
Always measure angles from the 'Normal' (the perpendicular line), not the surface. That's where 90% of mistakes happen!`;
    }

    if (topicLower.includes('gravitation')) {
      return `🧩 Explain Simply: Gravitation

Think of every object in the universe as having invisible "Elastic Bands" attached to every other object.
1. The heavier the object, the stronger the elastic band (Mass).
2. The further away they are, the more the elastic band stretches and weakens (Distance).

Newton's Law says: If you double the distance, the pull doesn't just halve—it becomes 4 times weaker! (Inverse Square Law).

📋 Insight:
Weight is just the Earth pulling your elastic band. On the moon, the "Moon's bands" are weaker because the moon is lighter!`;
    }

    if (topicLower.includes('motion') || topicLower.includes('newton')) {
      return `🧩 Explain Simply: Laws of Motion

Think of things as being extremely "Lazy" or "Stubborn".
1. Inertia (1st Law): An object at rest wants to stay sleeping. An object moving wants to keep moving. It hates changing its state.
2. Acceleration (2nd Law): If you want to move a Heavy Mud-stuck Car, you need a Huge Push (Force). F = ma.
3. Reaction (3rd Law): Every time you push a wall, the wall pushes you back with the exact same strength.

📋 Pro Tip:
In NEET, always solve 2nd Law problems by isolating the body and drawing all the "pushes" (Forces) acting on it first!`;
    }

    if (topicLower.includes('semiconductor')) {
      return `🧩 Explain Simply: Semiconductors

Think of a Semiconductor like a "Fickle Bridge":
1. The Bridge is normally broken (Insulator).
2. But if you give it a little heat or special passengers (Doping), the bridge gets repaired and starts allowing traffic (Conductor).

Intrinsic: Pure semiconductor.
Extrinsic: "Doped" with impurities to make it a better conductor (P-type or N-type).

📋 Key Insight:
In P-type, "Holes" (vacancies) are the main drivers. In N-type, "Electrons" (extra passengers) drive the traffic.`;
    }

    if (topicLower.includes('thermodynamics')) {
       return `🧩 Explain Simply: Thermodynamics

Think of a Heat Engine like a "Food Processor":
1. Heat Input (Q): The raw ingredients (Energy) you put in.
2. Work (W): The useful juice you get out (Action).
3. Waste Heat: The pulp left over that you throw away (Entropy).

1st Law: Energy is like Money. You can't create it from nothing, you can only spend it (Work) or save it (Internal Energy).

📋 Golden Rule:
Efficiency can NEVER be 100%. Nature always demands a "tax" (waste heat)!`;
    }

    return GENERIC_EXPLAIN(topic);
  }

  if (mode === 'pyq') {
     if (topicLower.includes('current')) {
         return `🎯 PYQ Patterns: Current Electricity
         
1. Meter Bridge & Potentiometer (Most Repeated): 
   - Patterns: Finding unknown resistance or comparing EMFs.
   - Shortcut: Use the ratio method (R/l = S/100-l) directly.
   
2. Kirchhoff's Laws:
   - Patterns: Finding current in a specific branch.
   - Trick: Use Nodal Analysis (V-junction method) to save time.

3. Combination of Resistors:
   - Patterns: Symmetry-based circuits.
   - Shortcut: Look for balanced Wheatstone bridge first!`;
     }
     if (topicLower.includes('optics')) {
         return `🎯 PYQ Patterns: Ray Optics

1. Lens Maker's Formula & Power:
   - Patterns: Silvering one side of a lens.
   - Shortcut: Total Power P = 2P_lens + P_mirror.

2. Total Internal Reflection (TIR):
   - Patterns: Critical angle and optical fibers.
   - Key: Sin θ_c = 1/μ.

3. Prism:
   - Patterns: Minimum deviation and small angle prisms.
   - Trick: For small angles, δ = (μ-1)A.`;
     }
  }

  if (mode === 'rapid') {
      if (topicLower.includes('modern physics')) {
          return `⏱️ Rapid Revision: Modern Physics

🚀 Formula Cheat-Sheet:
• E = hν = hc/λ
• K_max = hν - Φ
• r_n ∝ n²/Z
• E_n = -13.6 Z²/n² eV

⚠️ Top 3 Traps:
1. Intensity vs Frequency in Photoelectric effect.
2. Unit errors (eV vs Joules).
3. Bohr model is ONLY for single-electron species (H, He+, Li++).

⚡ Rapid MCQ Challenge:
1. If frequency is doubled, does saturation current change? (No)
2. Relation between de-Broglie λ and V? (λ ∝ 1/√V)`;
      }
      if (topicLower.includes('current')) {
          return `⏱️ Rapid Revision: Current Electricity

🚀 Formula Cheat-Sheet:
• V = IR (Ohm's Law)
• R = ρL/A
• P = VI = I²R = V²/R
• Heat = I²Rt

⚠️ Top 3 Traps:
1. Series vs Parallel Req formulas (Easy to flip).
2. Internal Resistance neglect in cells.
3. Power bulb brightness logic: Bulbs in series (P_rated ∝ 1/R), in parallel (P_rated ∝ R).

⚡ Rapid MCQ Challenge:
1. Does resistivity change with length? (No, only material & Temp)
2. Direction of drift velocity vs Current? (Opposite)`;
      }
  }

  if (mode === 'solver') {
      if (topicLower.includes('car accelerates uniformly')) {
          return `⚡ Step-by-Step Solver: Kinematics

Given:
- Initial velocity (u) = 0 m/s (from rest)
- Final velocity (v) = 20 m/s
- Time (t) = 10 s

Step 1: Find acceleration (a)
Using v = u + at
20 = 0 + a(10)
a = 2 m/s²

Step 2: Find distance (s)
Using s = ut + ½at²
s = (0)(10) + ½(2)(10²)
s = 100 m

✅ Answer: The distance covered is 100 meters.`;
      }
  }

  if (mode === 'mistake') {
      if (topicLower.includes('projectile max height')) {
          return `❌ Mistake Diagnosed: Projectile Motion

Your logic: H = u²/2g
Correct Formula: H = u² sin²θ / 2g

The Diagnosis:
You used the formula for "Motion under Gravity" (1D). In Projectile Motion (2D), only the VERTICAL component of velocity (u sinθ) contributes to height. 

The Fix:
Whenever you see "Projectile", always check the angle θ. If θ = 90°, your formula works. But for any other angle, you MUST include the sin²θ factor!`;
      }
  }

  return null;
};
