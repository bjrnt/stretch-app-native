import { ExerciseConfig, Side, StretchConfig } from "./Data";
import RoutineBuilder from "./RoutineBuilder";

// Routines from the "Right-Side Tightness Plan" (2026-10-17, revised 2026-10-27).

type TaskConfig = StretchConfig | ExerciseConfig;

function hold(name: string, duration: number, description: string): StretchConfig {
  return { description, duration, name, pauseAfter: true, type: "Stretch" };
}

function reps(name: string, repetitions: number | string, description: string): ExerciseConfig {
  return { description, name, repetitions, type: "Exercise" };
}

function right(task: TaskConfig): TaskConfig {
  return { ...task, side: "Right" };
}

// Repeats the tasks as a circuit, numbering each set.
function sets(count: number, ...tasks: Array<TaskConfig>): Array<TaskConfig> {
  return Array.from({ length: count }, (_, i) =>
    tasks.map((task) => ({ ...task, set: i + 1, sets: count })),
  ).flat();
}

function onSide(task: TaskConfig, side: Side, i: number, count: number): TaskConfig {
  return count > 1 ? { ...task, set: i + 1, sets: count, side } : { ...task, side };
}

// Alternates sides starting on the right, so extra right-side sets come last.
function sides(task: TaskConfig, right: number, left: number): Array<TaskConfig> {
  return Array.from({ length: Math.max(right, left) }, (_, i) => [
    ...(i < right ? [onSide(task, "Right", i, right)] : []),
    ...(i < left ? [onSide(task, "Left", i, left)] : []),
  ]).flat();
}

const rules = `**Release, then load.** Releases (R1–R4) open a window of about 20–30 minutes. Go straight into the strength and control work.

**Effort:** the last 2–3 reps are hard but your form holds. Muscle burn and fatigue are fine. Sharp pain, pinching at the front of the hip, or tingling and numbness in the arm or hand mean stop and modify.`;

// Release techniques

const r1 = right(
  reps(
    "R1 Hip Internal Rotation Hold-Relax",
    "3 rounds",
    `**Purpose:** quiets the guarding in the right deep hip rotators, so the right hip can rotate inward.

**Setup:** sit on a high surface (counter, table, high bed) so both feet hang freely. Sit tall on both sit bones. Thighs parallel, hip-width apart, knees at 90°.

1. Keep the right thigh still and the knee pointing straight ahead. Swing the right foot outward, away from the other foot, until it stops. Note roughly how far it goes.
2. **Contract the guarding muscles:** right hand on the **inside** of the right ankle. Press the foot inward into your hand at 20–30% effort for 5 seconds. Your hand stops any movement. Breathe normally.
3. **Relax** completely and breathe out for 2–3 seconds.
4. **Contract the opposite muscles:** take your hand away and use your hip muscles to swing the foot further outward. Hold the new end position for 5 seconds.
5. Relax and let the foot rest where it is.
6. From that new position, repeat steps 2–5. 3 rounds in total.

**Keep it honest:** the right sit bone stays down, you don't lean left, and the knee doesn't drift inward.

**No high surface?** Sit on a chair in socks on a smooth floor and slide the foot outward along the floor.

**Standing version:** stand on the left leg, a hand on a desk or wall. Right foot on a chair seat, hip and knee at about 90°, knee pointing ahead. Keep the knee in place and swing the foot outward, then do the same press, relax, swing sequence. Keep the pelvis level and facing forward.

**Normal:** a stretch at the outside or back of the hip, or the top front of the thigh. A pinch deep at the front of the hip means you've gone too far; back off a little.`,
  ),
);

const r2 = right(
  hold(
    "R2 Pec Minor Ball Release",
    60,
    `**Purpose:** reduces the pec minor tension that pulls the right shoulder blade forward.

**Find the spot:** follow the right collarbone outward. About 2–3 cm below its outer end is a bony knob (the coracoid). Work just below and slightly inward of it, on the front of the chest. Do **not** work inside the armpit hollow.

1. Single ball against a doorframe edge or wall. Lean in to about 5–6 out of 10 pressure.
2. Hold a tender point 20–30 seconds, breathing slowly.
3. Keeping the pressure on, slowly raise the right arm overhead and lower it 5–8 times.
4. Move the ball 1–2 cm down and inward along the muscle and repeat.

**Stop if** you get tingling, numbness, coldness or a dead feeling in the arm or hand.

**Afterward:** note how many hours the shoulder stays "back".`,
  ),
);

const r3Tfl = right(
  hold(
    "R3 TFL Ball Release",
    60,
    `**Find it:** the bony point at the front of your pelvis, where your belt rubs. TFL is the palm-sized muscle just below and slightly outside it.

1. Lie face down, ball under that spot, then turn slightly onto the front-outer right hip. Support yourself on your forearms.
2. Hold a tender point 20–30 seconds, breathing slowly.
3. Bend the right knee to 90° and slowly swing the shin side to side 6–8 times.

**Avoid** pressing directly on bone.`,
  ),
);

const r3GluteMed = right(
  hold(
    "R3 Glute Med Ball Release",
    60,
    `**Find it:** the upper outer buttock, between the top rim of the pelvis and the bony bump on the side of the upper thigh.

1. Lie on your back with knees bent. Ball under the upper outer right buttock, then roll slightly onto your right side to add pressure.
2. Hold a tender spot 20–30 seconds.
3. Slowly let the right knee fall outward and come back 6–8 times.

**Lighter pressure:** do it standing with the ball against a wall.

**Avoid** pressing directly on the pelvic rim or the bump on the side of the thigh.`,
  ),
);

const r4 = right(
  hold(
    "R4 Sternocleidomastoid Pinch-and-Hold",
    60,
    `**Purpose:** releases the right SCM, the muscle that reproduced your temple pressure on 2026-10-27. Stretching this muscle did little in the past; sustained pressure works better.

**Find it:** turn your head to the left. The SCM is the rope-like muscle that stands out on the right side of your neck, running from just behind and below the ear down to the inner end of the collarbone.

1. Turn your head slightly back toward the right to slacken the muscle.
2. Gently pinch the muscle belly between thumb and fingers, lifting it slightly away from the deeper neck. Start near the collarbone.
3. Find a tender spot and hold at about 4–5 out of 10 for 20–30 seconds, breathing slowly. Pressure spreading toward the temple or eye means you're on a relevant spot.
4. Move 1–2 cm up the muscle and repeat, working up toward the ear. Total 60–90 seconds.

**Safety:** pinch the muscle itself. Don't press into the front of the neck or anywhere you feel a pulse, because the carotid artery runs just inside the muscle. Stop if you feel dizzy or lightheaded, or notice vision changes.

**Afterward:** retest chin-tucked neck rotation and note any change in head pressure.`,
  ),
);

// Hip exercises

const h1 = hold(
  "H1 Single-Leg Stance, Level Pelvis",
  30,
  `**Setup:** barefoot, facing a mirror if possible, within reach of a wall or counter. Aim for 20–30 seconds.

1. Shift your weight onto the right foot, spread across heel, big toe and little toe.
2. Press the right foot into the floor and gently lift the left side of your pelvis a few millimetres. The side of the right hip switches on.
3. Lift the left foot 2–5 cm off the floor.
4. Check: belt line level, right hip stacked over the foot (not sliding out to the right), trunk upright, toes not gripping, right knee slightly soft.

**Feel it:** side of the right hip. Fatigue there is the point.

**Front of the hip instead?** Ease off the hip lift slightly and tuck your tailbone under a little.

**Progress:** eyes closed, then standing on a folded towel.`,
);

const h2 = reps(
  "H2 Side-Lying Hip Abduction",
  "12–15 repetitions",
  `**Setup:** lie on your side with your back and heels lightly against a wall. Bend the bottom knee, head on your arm, hips stacked vertically.

1. Straighten the top leg in line with your body or slightly behind it.
2. Turn the toes slightly down toward the floor, never toward the ceiling.
3. Leading with the heel, slide it up the wall and lift the leg about 30–40 cm, only as high as you can without the pelvis tilting or rolling back.
4. Pause 2 seconds at the top. Lower over 3 seconds without fully resting the leg.

**Feel it:** upper outer buttock.

**Front of the hip instead?** Move the leg further back and the toes further down.

**Progress:** a thin band around both ankles, or an ankle weight.`,
);

function h3(duration: number) {
  return hold(
    "H3 Side Plank",
    duration,
    `**Setup:** lie on your side, elbow directly under the shoulder, forearm on the floor. Easier: knees bent at 90°. Full: legs straight, feet stacked or top foot just in front.

1. Push the forearm into the floor so your shoulder doesn't sink toward your ear.
2. Lift your hips until your body is a straight line from head to knees (or feet).
3. Push your hips slightly forward so they don't pike back. Breathe steadily.

**Feel it:** side of the trunk and outer hip.

**Progress:** raise the top leg 20–30 cm and hold it there.`,
  );
}

const h4 = reps(
  "H4 Hip Airplane",
  5,
  `**Purpose:** trains the hip to rotate inward while carrying your body weight. Described for the right leg; mirror it for the left.

**Setup:** stand on the right leg beside a counter, fingertips on it, right knee slightly bent.

1. Hinge forward with a flat back until your trunk is at about 45°. The left leg extends behind in line with the trunk.
2. Keeping trunk and pelvis locked as one block, rotate open: the left hip turns up toward the ceiling. Take 3 seconds.
3. Rotate back and keep going into the closed position: the left hip turns down toward the floor, past level. Take 3 seconds. This is the restricted direction.
4. One open plus close is one rep.

**Keep it honest:** the rotation comes from the standing hip, not the spine. The knee points over the toes, the foot stays flat.

**Progress:** hinge deeper, toward horizontal, with less hand support.`,
);

const h5 = reps(
  "H5 Banded Lateral Walk",
  "10 steps each direction",
  `**Setup:** thin band just above the knees (easier) or around the forefoot (harder). Feet hip-width with the band taut. Quarter squat, hips slightly back, chest up.

1. Step sideways about 30 cm with the leading foot.
2. Bring the trailing foot back to hip-width. Never let the feet come together or the band go slack.
3. Toes forward, knees not caving in, trunk not rocking.
4. 10 steps one direction, then 10 back.

**Feel it:** upper outer buttock on both sides.`,
);

const h6 = reps(
  "H6 Lateral Step-Down",
  8,
  `**Setup:** a step 10–15 cm high. Stand side-on with the working foot on the step and the other foot hanging off the side. Hands on hips, mirror in front if possible.

1. Over 3 seconds, bend the knee and push your hips back, lowering the free heel toward the floor.
2. Tap the heel lightly on the floor without putting weight on it.
3. Push through the standing foot to return.

**Watch:** the free hip doesn't drop, the knee tracks over the second toe, the trunk doesn't lean sideways.

**Regress:** hold the rail, or don't lower all the way. **Progress:** a 20 cm step, or a 5-second lowering.`,
);

const h7Description = `**Setup:** sit on the floor, knees bent about 90°, feet planted wider than your hips, hands on the floor behind you.

1. Let both knees fall to the right: right shin across your body in front, left shin out to the side behind. Keep both knees near 90°.
2. Lift both knees back through the middle and lower them to the left. Now the right leg is the back leg: right hip internal rotation.
3. In the left-side position, pause 3–5 seconds and gently press the right knee toward the floor.
4. Move slowly with your heels as pivots, sitting as tall as you can.

**Regress:** lean back on your hands more, or bring your feet slightly closer together.`;

const h7 = reps("H7 90/90 Hip Switches", "8 switches to each side", h7Description);

const h8 = reps(
  "H8 Bulgarian Split Squat",
  8,
  `**Setup:** stand 60–80 cm in front of a bench, couch or chair, facing away. Rest the top of the back foot on it. The front leg does the work.

1. Stand tall with a slight forward lean, with or without weights.
2. Lower straight down over 2–3 seconds until the front thigh is roughly parallel to the floor.
3. Drive through the whole front foot to stand up.

**Watch:** pelvis level and square to the front. Don't let the right hip drift forward or rotate. The knee tracks over the second toe, most weight on the front foot.`,
);

const h9 = reps(
  "H9 Single-Leg Romanian Deadlift",
  8,
  `**Setup:** stand on one leg, knee bent 15–20°. Weight in the opposite hand, or none. Fingertips on a counter at first.

1. Hinge at the hip, pushing your hips back. The trunk tips forward while the free leg extends straight back in line with it.
2. Go until your trunk is near parallel or your back can't stay flat. Take 3 seconds.
3. Keep the pelvis square to the floor, toes of the lifted leg pointing down. The free hip must not open up toward the ceiling.
4. Squeeze the standing glute and drive your hips forward to stand up.`,
);

const h10 = reps(
  "H10 Step-Up",
  8,
  `**Setup:** a sturdy step, box or chair about 30–40 cm high.

1. Place the whole working foot on the step.
2. Lean slightly forward and drive through the heel and midfoot to stand up. Use the other foot as little as possible, toes only.
3. Stand tall at the top with your pelvis level.
4. Lower slowly on the working leg over 3 seconds.

**Watch:** the knee stays over the second toe and the pelvis stays level.`,
);

const h11 = hold(
  "H11 Half-Kneeling Hip Flexor Stretch",
  45,
  `**Setup:** kneel on the side being stretched (right knee for the right side) on a cushion, other foot flat in front, both knees at about 90°, torso upright.

1. Tuck your tailbone under, as if bringing your belt buckle toward your chin, and squeeze the glute of the kneeling leg.
2. Keeping the tuck, shift your whole body forward a few centimetres. Don't arch your lower back.
3. Optional: raise the arm on the kneeling side overhead and lean slightly away from it.
4. Breathe slowly.

**Feel it:** front of the hip and upper thigh, not the lower back.`,
);

// Shoulder blade and neck exercises

const s1 = reps(
  "S1 Wall Slide with Lift-Off",
  10,
  `**Setup:** face a wall, toes about one foot-length away. Forearms on the wall, little-finger side touching, elbows at shoulder height and shoulder-width apart. Lean slightly in.

1. Press the forearms lightly into the wall so the shoulder blades spread around your ribs.
2. Keep pressing and slide the forearms up and slightly out into a Y, until the elbows are at or above head height. Don't shrug.
3. At the top, lift both forearms 2–3 cm off the wall and hold 2 seconds. Ribs down, lower back not arching.
4. Put the forearms back on the wall and slide down slowly.

**Feel it:** side of the ribs under the armpit and below the shoulder blades. Not the neck.

**Progress:** a light band around both wrists, pressing outward against it.`,
);

const s2 = reps(
  "S2 Push-Up Plus",
  10,
  `**Setup:** against a wall or counter (easiest), then on the floor on your knees, then a full push-up. Hands under your shoulders.

1. Do a normal push-up, body straight.
2. At the top, elbows locked, push the floor away further: the upper back rounds slightly as the shoulder blades spread. Hold 2 seconds.
3. Let the shoulder blades slide back together slowly, elbows straight.

**Simpler version:** on hands and knees, do only the "plus" part.

**Feel it:** side of the ribs under the armpit.`,
);

const s3 = reps(
  "S3 Band External Rotation",
  12,
  `**Setup:** band anchored at elbow height. Stand with the anchor on the opposite side of the working arm. Elbow at 90°, upper arm at your side, a rolled towel between elbow and ribs.

1. Set the shoulder blade gently back and down.
2. Rotate the forearm outward, away from your belly, keeping the elbow on the towel and the trunk still.
3. Pause 1 second, return over 3 seconds.

**Feel it:** back of the shoulder and below the shoulder blade.

**No anchor:** hold one band in both hands, elbows at your sides, and rotate both forearms outward together.

**Common mistakes:** the elbow drifting off the body, the wrist bending, the trunk rotating.`,
);

const s4Setup = `**Setup:** lie face down, forehead on a folded towel, chin slightly tucked. Don't lift your head.`;
const s4Notes = `**Feel it:** between and below the shoulder blades.

**Neck or upper shoulders taking over?** Lift less high and reset the shoulder blades down.

**Progress:** 0.5–1 kg weights.`;

const s4Y = reps(
  "S4 Prone Y Raise",
  8,
  `${s4Setup}

1. Arms overhead, angled out about 45° in a Y, thumbs to the ceiling.
2. Draw your shoulder blades gently down toward your back pockets.
3. Lift both arms 3–5 cm and hold 2–3 seconds. Lower slowly.

${s4Notes}`,
);

const s4T = reps(
  "S4 Prone T Raise",
  8,
  `${s4Setup}

1. Arms straight out to the sides at shoulder height, thumbs to the ceiling.
2. Draw your shoulder blades gently toward your spine.
3. Lift both arms 3–5 cm and hold 2–3 seconds. Lower slowly.

${s4Notes}`,
);

const s5 = reps(
  "S5 Chin Nod",
  10,
  `**Purpose:** trains the deep neck flexors that hold your head over your shoulders.

**Setup:** lie on your back, knees bent, head on the floor or a thin towel so your face is level.

1. Keeping the back of your head down, make a tiny "yes" nod: chin slightly toward the throat, about 1 cm.
2. Hold 5 seconds at gentle effort, about 20–30%.
3. Release fully, then repeat.

**Check:** fingertips on the front of your neck. The large ropey muscles there stay soft.

**Common mistakes:** pushing the head back, lifting the head, clenching the jaw. Tongue on the roof of the mouth, teeth apart.

**Test vs training:** this is the training. The weekly deep neck flexor hold, with the head lifted, is the test. Don't train with the head-lift version yet.`,
);

const s6 = reps(
  "S6 Band Row or Face Pull",
  12,
  `Pick one per session, or alternate between sessions.

**Row:** band at chest height, facing it, arms forward with the band taut. Pull your elbows back past your ribs while drawing the shoulder blades back and down. Pause 1–2 seconds, return over 3 seconds. Don't shrug, poke your head forward or arch your back.

**Face pull:** band at face height, palms down. Pull toward your forehead with elbows high and wide, finishing with hands beside your ears and forearms pointing up. Pause 1–2 seconds and return slowly.

**Feel it:** between the shoulder blades and at the back of the shoulders.`,
);

// Trunk rotation and breathing

const t1Description = `**Setup:** lie on your side, hips and knees bent to 90°, pillow under your head and between the knees. Arms straight out in front at shoulder height, palms together. To rotate **right**, lie on your left side and open the right arm.

1. Keep both knees together and pressed down.
2. Breathe in. As you breathe out, sweep the top arm up and over, turning your chest toward the ceiling and the other side. Follow your hand with your eyes.
3. Go as far as you comfortably can with the knees together. Let the arm settle for one slow breath.
4. Return slowly.

**Feel it:** mid-back and chest. Lower back means your knees have separated or lifted.`;

const t1Left = reps("T1 Open Book (Rotating Left)", 8, t1Description);
const t1Right = reps("T1 Open Book (Rotating Right)", 12, t1Description);

const t2Description = `**Setup:** lie on your back, feet flat on a wall, hips and knees at 90°, small pillow under your head. One hand on your belly, one on your lower ribs.

1. Press your heels gently into the wall and lift your tailbone 1–2 cm so the lower back rests on the floor. Not a bridge.
2. Breathe in through your nose for about 4 seconds, widening the lower ribs sideways and into your back.
3. Breathe out slowly through your mouth for 6–8 seconds, like a long sigh. Let the ribs drop down and in.
4. Pause 2–3 seconds before the next breath.

**Feel it:** abdominals working gently at the end of each exhale, neck relaxed.`;

const t2 = hold("T2 90/90 Wall Breathing", 120, t2Description);

const t2Breathing = `Breathe as in T2: in through the nose for about 4 seconds, widening the lower ribs; out through the mouth for 6–8 seconds, letting the ribs drop; pause 2–3 seconds.`;

const t3 = reps(
  "T3 Thread the Needle",
  6,
  `**Setup:** on hands and knees, hands under shoulders, knees under hips. Described for the right arm; mirror it for the left.

1. Slide your right hand under your body toward the left, palm up. Lower the right shoulder and side of the head toward the floor. Hold 2–3 seconds.
2. Sweep the right arm back out and up toward the ceiling, opening your chest. Follow your hand with your eyes and hold 2–3 seconds.
3. One thread and open is one rep.

**Keep it honest:** hips stay over the knees; the movement comes from your upper back.`,
);

// Bad-day releases and stretches

const spinePeanutBall = right(
  hold(
    "Spine Peanut Ball",
    120,
    `Lie on your back with the peanut ball across your spine, one ball on each side, starting at mid-back. Cross your arms over your chest to spread the shoulder blades. Hold 30 seconds, then move the ball up one vertebra at a time, to the base of the neck.`,
  ),
);

const shoulderBladeBall = right(
  hold(
    "Shoulder Blade Ball Release",
    60,
    `Lie on your back, knees bent, a single ball under the sore spot between the right shoulder blade and spine. Reach the right arm across your chest to open the area up. Hold tender spots.`,
  ),
);

const neckSideTilt = right(
  hold(
    "Neck Side Tilt",
    30,
    `Gentle. Seated, hold the edge of the chair seat with your right hand. Tilt your left ear toward your left shoulder.`,
  ),
);

const neckTurn = right(
  hold(
    "Neck Turn",
    30,
    `Gentle. Still holding the chair seat with your right hand, turn your nose toward your left armpit.`,
  ),
);

// Routines

const thirtyMinuteTasks: Array<TaskConfig> = [
  r1,
  r2,
  r3Tfl,
  r3GluteMed,
  r4,
  ...sets(2, h5),
  ...sides(h3(40), 2, 1),
  ...sides(h6, 3, 2),
  ...sides(h4, 3, 3),
  ...sets(2, h7),
  ...sets(2, s2),
  ...sides(s3, 2, 2),
  ...sets(2, s4Y, s4T),
  ...sets(2, s5),
  t1Left,
  t1Right,
  t2,
];

export default {
  RightSide02Min: new RoutineBuilder(
    "Right Side: 2 min",
    `Daily, anywhere. Also within an hour after long runs.

${rules}`,
  )
    .withTasks(r1, ...sides(h1, 3, 0))
    .build(),
  RightSide10Min: new RoutineBuilder(
    "Right Side: 10 min",
    `3–5 days a week.

${rules}`,
  )
    .withTasks(
      r1,
      r2,
      r4,
      ...sides(h2, 2, 1),
      ...sides(h3(30), 2, 1),
      ...sides(h4, 3, 2),
      ...sets(2, s1),
    )
    .build(),
  RightSide30Min: new RoutineBuilder(
    "Right Side: 30 min",
    `2–3 days a week. Replaces sporadic yoga.

${rules}`,
  )
    .withTasks(...thirtyMinuteTasks)
    .build(),
  RightSide60Min: new RoutineBuilder(
    "Right Side: 60 min",
    `Once a week, optional. The full 30-minute session, then single-leg strength and mobility.

${rules}`,
  )
    .withTasks(
      ...thirtyMinuteTasks,
      ...sides(h8, 3, 2),
      ...sides(h9, 3, 2),
      ...sides(h10, 3, 2),
      ...sets(3, s6),
      ...sides(h11, 3, 2),
      ...sides(t3, 2, 2),
      hold("H7 90/90 Hip Switches (Slow)", 180, h7Description),
    )
    .build(),
  RightSideBadDay: new RoutineBuilder(
    "Right Side: Bad Day",
    `On very sore days the goal is relief, not progress. About 20–30 minutes: do what helps and skip the rest. Skip the strength sessions today. Walking is fine and helps.

**Massage and release:** moderate pressure, around 5–6 out of 10. Hold each tender spot 20–30 seconds while breathing slowly.

**Stretching:** gentle, 30–45 seconds each, breathing slowly.

**Don't stretch** the right glute med or the area between the shoulder blade and spine. They're sore from being strained in a lengthened position, so give them pressure instead.

**Back off** if anything brings on tingling, numbness or sharp pain, or leaves you worse an hour later.`,
  )
    .withTasks(
      hold(
        "Heat",
        600,
        `A hot shower, or a heat pad on the right lower back and hip. 10–15 minutes.`,
      ),
      hold(
        "Supported Rest with Breathing",
        240,
        `Lie on your back with your calves resting on a couch or chair, hips and knees at 90°. This takes load off the hip flexors and lower back. 3–5 minutes.

${t2Breathing}`,
      ),
      r3Tfl,
      r3GluteMed,
      spinePeanutBall,
      shoulderBladeBall,
      r2,
      right(
        hold(
          "Front Thigh Foam Roll",
          60,
          `Lie face down with the foam roller under the front of the right thigh, from just below the hip bone to mid-thigh. Roll slowly, pausing on tender spots.`,
        ),
      ),
      right(
        hold(
          "Lat Foam Roll",
          60,
          `Lie on your right side with the foam roller just below the armpit and your right arm overhead. Roll a short range, a hand's width.`,
        ),
      ),
      right(
        hold(
          "Psoas Release (Optional)",
          90,
          `Lie face down with the psoas tool just inside the right front hip bone, to the side of your belly button. Sink in slowly and breathe for 60–90 seconds.

**Stop if** you feel a pulse under the tool, sharp pain or nausea.`,
        ),
      ),
      r1,
      ...sides(h11, 2, 0),
      ...sides(
        hold(
          "Figure-4 Stretch",
          45,
          `Lie on your back, right ankle crossed over the left knee. Pull the left thigh toward your chest until you feel a stretch in the right buttock.`,
        ),
        2,
        0,
      ),
      ...sides(
        hold(
          "Doorway Pec Stretch",
          30,
          `Right forearm on the doorframe, elbow slightly above shoulder height. Step through and turn your chest gently away.

**Stop if** your hand tingles.`,
        ),
        2,
        0,
      ),
      ...sides(
        hold(
          "Child's Pose with Side Reach",
          45,
          `Kneel and sit back toward your heels. Walk both hands over to the left until you feel a stretch along your right side.`,
        ),
        2,
        0,
      ),
      neckSideTilt,
      neckTurn,
      { ...t1Right, repetitions: "8 slow repetitions" },
      reps(
        "Easy Walk (Optional)",
        "an easy 15–20 minute walk",
        `Walking is fine on bad days and helps.`,
      ),
    )
    .build(),
  RightSideHeadPressure: new RoutineBuilder(
    "Right Side: Head Pressure",
    `For mornings with pressure behind the eyes, foggy focus or light and sound sensitivity. It targets the neck rather than the hip. About 25 minutes.

**Re-rate the pressure 30 minutes after finishing.** A drop of 2 or more points supports the muscle explanation. Note the result in the morning log.

Skip strength work, avoid long head-down positions (they make the pressure worse), and walk if you can. An over-the-counter painkiller is fine occasionally, but taking painkillers on more than about 10 days a month can cause rebound headaches, so log when you take one.

**See a doctor promptly** if headaches get progressively worse, wake you from sleep, reach full intensity within about a minute, or come with vision changes, weakness, numbness or confusion.`,
  )
    .withTasks(
      reps(
        "Rate the Pressure",
        "0–10 rating",
        `Rate the pressure 0–10 before starting, so you can tell whether the routine helped. Re-rate 30 minutes after finishing.`,
      ),
      right(
        hold(
          "Neck Heat",
          900,
          `Heat on the right neck and upper trap, 15–20 minutes, with a cloth layer between the pack and your skin. Don't fall asleep on it.`,
        ),
      ),
      right(
        hold(
          "Easing Position Rest",
          240,
          `Rest with your head tilted right and slightly down, supported by a pillow. This slackens the right SCM and upper trap.

${t2Breathing}`,
        ),
      ),
      { ...r4, duration: 90 },
      spinePeanutBall,
      shoulderBladeBall,
      { ...t1Right, repetitions: "8 gentle repetitions" },
      neckSideTilt,
      neckTurn,
    )
    .build(),
};
