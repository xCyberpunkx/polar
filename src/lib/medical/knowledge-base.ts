// Medical knowledge base for Polar
// Sources: DSM-5, CANMAT 2018 Guidelines, NICE Guidelines CG185,
//          BAP Guidelines 2016, ISBD consensus statements
// IMPORTANT: This is psychoeducational content only. Not medical advice.

export interface Article {
  slug: string
  title: string
  category: 'understanding' | 'treatment' | 'lifestyle' | 'crisis' | 'relationships'
  readTime: number // minutes
  summary: string
  content: Section[]
  sources: string[]
  lastReviewed: string
}

export interface Section {
  heading: string
  body: string
  callout?: { type: 'warning' | 'info' | 'tip'; text: string }
}

export const ARTICLES: Article[] = [
  {
    slug: 'what-is-bipolar-disorder',
    title: 'Understanding Bipolar Disorder',
    category: 'understanding',
    readTime: 8,
    summary: 'A clear, evidence-based explanation of what bipolar disorder is, how it works neurologically, and what the research actually says.',
    lastReviewed: '2024-01',
    sources: [
      'DSM-5-TR, American Psychiatric Association (2022)',
      'CANMAT & ISBD 2018 guidelines for the management of bipolar disorder',
      'Goodwin & Jamison, Manic-Depressive Illness (2nd ed, 2007)',
    ],
    content: [
      {
        heading: 'What it actually is',
        body: 'Bipolar disorder is a chronic mood disorder characterized by episodes of mania or hypomania alternating with episodes of depression, separated by periods of relative stability. It affects approximately 1-2% of the global population across all cultures, socioeconomic groups, and genders equally. It is a neurobiological condition — not a character flaw, not a choice, and not something that can be willed away.',
      },
      {
        heading: 'The brain science',
        body: 'Research consistently shows structural and functional differences in the brains of people with bipolar disorder, particularly in the prefrontal cortex (executive function, impulse control) and amygdala (emotional processing). Dysregulation of dopamine, serotonin, and norepinephrine neurotransmitter systems plays a central role. Circadian rhythm disruption is increasingly understood as both a cause and consequence of mood episodes.',
        callout: { type: 'info', text: 'Bipolar disorder has one of the highest heritability rates of any psychiatric condition — approximately 60-80% according to twin studies. Having a first-degree relative with bipolar disorder increases risk roughly 10-fold.' },
      },
      {
        heading: 'Types of bipolar disorder',
        body: 'Bipolar I is defined by at least one manic episode lasting 7+ days (or any duration if hospitalization is required). Depressive episodes are common but not required for diagnosis. Bipolar II involves hypomanic episodes (less severe than mania, no psychosis) and at least one major depressive episode. Cyclothymia involves chronic mood instability for 2+ years that does not meet full criteria for mania or major depression. Mixed features — simultaneous manic and depressive symptoms — can occur in any type and are associated with higher suicide risk.',
      },
      {
        heading: 'Course and prognosis',
        body: 'With proper treatment, most people with bipolar disorder lead full, productive lives. Without treatment, episodes typically become more frequent and severe over time (a process called kindling). The average delay between symptom onset and correct diagnosis is 5-10 years, often because depressive episodes are presented first and mania/hypomania goes unrecognized. Early intervention and consistent treatment significantly improve long-term outcomes.',
        callout: { type: 'tip', text: 'Tracking your mood, sleep, and medication consistently — exactly what Polar is built for — is one of the most evidence-based interventions for improving long-term stability.' },
      },
    ],
  },
  {
    slug: 'recognizing-mania-hypomania',
    title: 'Recognizing Mania and Hypomania',
    category: 'understanding',
    readTime: 6,
    summary: 'How to identify manic and hypomanic episodes — including the early warning signs that are easy to miss.',
    lastReviewed: '2024-01',
    sources: [
      'DSM-5-TR diagnostic criteria for Bipolar I and II',
      'ISBD consensus on early intervention in bipolar disorder',
      'Berk et al. (2007), The validity of the bipolar spectrum',
    ],
    content: [
      {
        heading: 'DSM-5 criteria for a manic episode',
        body: 'A distinct period of abnormally elevated, expansive, or irritable mood AND increased goal-directed activity or energy, lasting at least 7 days and present most of the day, nearly every day. During this period, 3 or more of the following must be present: inflated self-esteem or grandiosity, decreased need for sleep, more talkative than usual or pressured speech, racing thoughts or flight of ideas, distractibility, increased goal-directed activity or psychomotor agitation, and excessive involvement in activities with high potential for painful consequences.',
        callout: { type: 'warning', text: 'Mania is a medical emergency when it involves psychosis, inability to care for yourself, or dangerous behavior. Seek emergency care immediately if this applies.' },
      },
      {
        heading: 'Hypomania: the subtle one',
        body: 'Hypomania uses the same criteria as mania but requires only 4 days duration and causes no marked impairment in functioning or hospitalization. This is why it is frequently missed — or even enjoyed. Many people report hypomania as their most productive, creative, and social state. The danger is that hypomania often escalates into full mania, or is followed by severe depression. The pattern is more important than any single episode.',
      },
      {
        heading: 'Common early warning signs (prodromal symptoms)',
        body: 'Research shows that most people have a recognizable prodrome — a set of early warning signs — before a full episode. Common ones include: reduced need for sleep without feeling tired, increased energy or motivation that feels unusual, increased talkativeness or faster thinking, increased confidence or ambition, more spending or plans being made, irritability or impatience, increased sexual interest, and decreased appetite. Identifying YOUR personal prodrome through tracking is one of the highest-value things you can do.',
      },
      {
        heading: 'Irritable mania',
        body: 'Not all mania looks euphoric. Irritable mania — characterized by rage, frustration, and conflict rather than elation — is common and often misdiagnosed as personality disorder or ADHD. People in irritable manic states often describe feeling "wired but miserable" or deeply agitated. Recognizing this as a manic variant is clinically important because treatment differs from depression.',
      },
    ],
  },
  {
    slug: 'understanding-bipolar-depression',
    title: 'Bipolar Depression: Different from Unipolar',
    category: 'understanding',
    readTime: 7,
    summary: 'Why bipolar depression is clinically distinct from unipolar depression, how to recognize it, and why standard antidepressants can be harmful.',
    lastReviewed: '2024-01',
    sources: [
      'CANMAT 2018 guidelines — first-line treatments for bipolar depression',
      'Ghaemi et al. (2004), Antidepressant discontinuation in bipolar disorder',
      'NICE Guidelines CG185 — Bipolar disorder: assessment and management',
    ],
    content: [
      {
        heading: 'Why it\'s different',
        body: 'Bipolar depression and unipolar (standard) depression share many symptoms but differ in important ways. Bipolar depression more commonly features hypersomnia (sleeping too much rather than too little), psychomotor retardation (slowed movement and thinking), leaden paralysis (heavy limbs), increased appetite, and atypical features. It also tends to have a more abrupt onset and offset, and more frequent episodes.',
        callout: { type: 'warning', text: 'Antidepressants prescribed without a mood stabilizer can trigger mania, hypomania, or rapid cycling in bipolar disorder. If you are being treated for depression and have not been screened for bipolar disorder, please discuss this with your psychiatrist.' },
      },
      {
        heading: 'The suicidal risk reality',
        body: 'Bipolar disorder carries a lifetime suicide attempt rate of approximately 25-50% and a completed suicide rate roughly 20-30x higher than the general population. Depressive episodes, mixed states, and the transition period coming out of depression (when energy returns before mood lifts) are highest-risk periods. This is not stated to frighten — it is stated because awareness and monitoring are the most protective factors. If you are having suicidal thoughts, please see the Crisis Resources page.',
        callout: { type: 'warning', text: 'If you are currently having thoughts of suicide or self-harm, go to the Crisis Resources page or contact emergency services immediately.' },
      },
      {
        heading: 'What actually works for bipolar depression',
        body: 'First-line evidence-based treatments for bipolar depression according to CANMAT 2018 include: quetiapine, lithium or valproate, lurasidone (adjunctive), and lamotrigine (for maintenance/prevention). Psychotherapy, particularly Cognitive Behavioral Therapy (CBT), Interpersonal and Social Rhythm Therapy (IPSRT), and Family-Focused Therapy, have strong evidence as adjunctive treatments. Lifestyle interventions — particularly sleep regulation — are increasingly supported by evidence.',
      },
    ],
  },
  {
    slug: 'sleep-and-bipolar',
    title: 'Sleep: The Most Important Variable',
    category: 'lifestyle',
    readTime: 7,
    summary: 'Why sleep disruption is both a trigger and a symptom of bipolar episodes, and evidence-based strategies to protect your sleep.',
    lastReviewed: '2024-01',
    sources: [
      'Harvey (2008), Sleep and circadian rhythms in bipolar disorder',
      'Bauer et al. (2006), Relationship between sleep and mood in bipolar disorder',
      'Frank et al. (2005), Interpersonal and Social Rhythm Therapy (IPSRT)',
      'ISBD Task Force Report on Chronobiology in Bipolar Disorder',
    ],
    content: [
      {
        heading: 'The bidirectional relationship',
        body: 'Sleep disruption is not just a symptom of bipolar disorder — it is one of the most potent triggers for new episodes. Studies show that even one night of reduced sleep can precipitate hypomania in vulnerable individuals. The relationship is bidirectional: mood episodes disrupt sleep, and sleep disruption triggers mood episodes. This makes sleep the single highest-leverage lifestyle variable for stability.',
        callout: { type: 'warning', text: 'If you notice you\'ve slept significantly less than usual for 2+ nights but don\'t feel tired, this is a warning sign that requires immediate attention. Contact your psychiatrist.' },
      },
      {
        heading: 'Circadian rhythm disruption',
        body: 'Bipolar disorder is increasingly understood as a disorder of circadian rhythm regulation. People with bipolar disorder show abnormal melatonin secretion, altered cortisol rhythms, and disrupted social rhythms. Anything that disrupts your body clock — shift work, jet lag, irregular schedules, night-time light exposure, alcohol — is a direct risk factor for episodes.',
      },
      {
        heading: 'Evidence-based sleep strategies',
        body: 'The following have evidence in bipolar populations: maintaining consistent sleep and wake times (even on weekends), keeping the bedroom cool and dark, avoiding screens 60 minutes before bed, avoiding caffeine after 2pm, no alcohol (disrupts sleep architecture despite inducing drowsiness), regular exercise but not within 3 hours of bedtime, and morning light exposure to anchor your circadian rhythm.',
        callout: { type: 'tip', text: 'Interpersonal and Social Rhythm Therapy (IPSRT) — a therapy specifically developed for bipolar disorder — is built around stabilizing daily rhythms including sleep. Ask your therapist about it.' },
      },
      {
        heading: 'When sleep is impossible during episodes',
        body: 'During depressive episodes, hypersomnia (sleeping 10-14+ hours) is common. During manic episodes, reduced need for sleep occurs. These are symptoms, not choices. During these periods, maintaining the most regular schedule possible — even if imperfect — is more protective than abandoning routine entirely. Your psychiatrist may also have medication adjustments that can help.',
      },
    ],
  },
  {
    slug: 'medication-overview',
    title: 'Medications for Bipolar Disorder: An Overview',
    category: 'treatment',
    readTime: 10,
    summary: 'Evidence-based overview of the main medication classes used in bipolar disorder — what they do, what to watch for, and questions to ask your psychiatrist.',
    lastReviewed: '2024-01',
    sources: [
      'CANMAT 2018 guidelines for management of bipolar disorder in adults',
      'NICE Guidelines CG185',
      'BAP updated guidelines on the management of bipolar disorder (2016)',
      'FDA prescribing information for listed medications',
    ],
    content: [
      {
        heading: 'Mood stabilizers',
        body: 'Lithium remains the gold standard mood stabilizer with the strongest evidence base over 60+ years of research. It reduces the frequency and severity of both manic and depressive episodes and is the only psychiatric medication with robust evidence for suicide prevention. Requires regular blood monitoring (kidney function, thyroid, lithium levels). Valproate (Depakote) is effective for mania and mixed states, widely used, requires monitoring of liver function and blood counts. Lamotrigine (Lamictal) is particularly effective for bipolar depression and maintenance, with good tolerability — requires very slow dose titration to avoid rare but serious skin reactions.',
        callout: { type: 'warning', text: 'Never stop mood stabilizers abruptly. Discontinuation — especially of lithium — can trigger severe rebound episodes. Always taper under psychiatrist supervision.' },
      },
      {
        heading: 'Atypical antipsychotics',
        body: 'Several atypical antipsychotics have FDA approval for bipolar disorder. Quetiapine (Seroquel) has the broadest evidence — approved for mania, bipolar depression, and maintenance. Aripiprazole, olanzapine, risperidone, ziprasidone, and lurasidone are also used. Common considerations: metabolic effects (weight gain, glucose, lipid changes), sedation, and EPS (movement effects, more common with older agents). Regular metabolic monitoring is recommended.',
      },
      {
        heading: 'Anticonvulsants',
        body: 'Beyond valproate and lamotrigine, carbamazepine and oxcarbazepine are used for treatment-resistant cases. Gabapentin and pregabalin are sometimes used adjunctively for anxiety. These require their own monitoring parameters and have significant drug interaction profiles.',
      },
      {
        heading: 'Questions to ask your psychiatrist',
        body: 'For any medication: What is the target we are treating (mania, depression, maintenance, sleep, anxiety)? What are the most common side effects? What are the rare but serious ones I should watch for? How will we know it is working? What monitoring do I need? What happens if I miss a dose? Are there interactions with other medications, supplements, or alcohol? Is there a generic version?',
        callout: { type: 'tip', text: 'Bring your Polar report to every psychiatrist appointment. Objective mood, sleep, and medication adherence data significantly improves treatment decisions.' },
      },
    ],
  },
  {
    slug: 'therapy-approaches',
    title: 'Evidence-Based Therapy for Bipolar Disorder',
    category: 'treatment',
    readTime: 6,
    summary: 'The psychotherapy approaches with the strongest evidence for bipolar disorder, and what each one focuses on.',
    lastReviewed: '2024-01',
    sources: [
      'Miklowitz et al. (2007), Psychosocial treatments for bipolar depression',
      'Frank et al. (2005), IPSRT and bipolar disorder',
      'CANMAT 2018 — psychological interventions in bipolar disorder',
      'Scott et al. (2006), CBT for bipolar disorder',
    ],
    content: [
      {
        heading: 'Cognitive Behavioral Therapy (CBT)',
        body: 'CBT adapted for bipolar disorder targets the thought patterns and behaviors that maintain or worsen mood episodes. Key components include mood monitoring (which Polar automates), identifying early warning signs, behavioral activation during depression, activity scheduling, and challenging cognitive distortions. Multiple RCTs show CBT reduces relapse rates and improves functioning.',
      },
      {
        heading: 'Interpersonal and Social Rhythm Therapy (IPSRT)',
        body: 'IPSRT is a bipolar-specific therapy built on the finding that disruptions to daily social rhythms trigger mood episodes. It combines interpersonal therapy with behavioral strategies for stabilizing sleep-wake cycles, meal times, and daily routines. It is particularly effective for preventing episodes and is highly compatible with the tracking approach Polar uses.',
      },
      {
        heading: 'Family-Focused Therapy (FFT)',
        body: 'FFT involves the patient and family members in psychoeducation, communication training, and problem-solving. It has strong evidence for reducing relapse, particularly in patients from high-conflict family environments. The family component is critical because bipolar disorder affects relationships deeply and family members are often primary supports during episodes.',
      },
      {
        heading: 'Psychoeducation',
        body: 'Structured psychoeducation — learning about bipolar disorder, treatment, early warning signs, and relapse prevention — is one of the most consistently evidence-supported interventions. Group psychoeducation programs (like the Barcelona program) show significant reductions in hospitalizations. The knowledge you build through Polar\'s Learn section is a form of self-directed psychoeducation.',
      },
    ],
  },
  {
    slug: 'triggers-and-protection',
    title: 'Known Triggers and Protective Factors',
    category: 'lifestyle',
    readTime: 6,
    summary: 'What the research says about what reliably triggers bipolar episodes — and what consistently protects against them.',
    lastReviewed: '2024-01',
    sources: [
      'Proudfoot et al. (2011), Triggers of mania and depression in bipolar disorder',
      'Bauer et al. (2006), Life events and bipolar disorder',
      'ISBD consensus on lifestyle interventions',
    ],
    content: [
      {
        heading: 'Evidence-based triggers',
        body: 'The most reliably documented triggers for bipolar episodes are: sleep disruption (especially reduced sleep for mania, disrupted schedule for both), stressful life events (both positive and negative — the stress response matters more than the valence), substance use (alcohol and recreational drugs disrupt mood regulation and interact with medications), seasonal changes (many people show spring/summer hypomania and winter depression), stopping medications, and interpersonal conflict.',
        callout: { type: 'warning', text: 'Alcohol is the most commonly used and most damaging substance for people with bipolar disorder. Even moderate alcohol use disrupts sleep architecture, interacts with most psychiatric medications, and increases episode frequency.' },
      },
      {
        heading: 'Protective factors with evidence',
        body: 'Consistent medication adherence is the most powerful protective factor — the research is unambiguous. Beyond medication: regular sleep-wake schedule, aerobic exercise (shown to reduce depressive symptoms and improve cognitive function), strong social support network, psychotherapy, regular psychiatric follow-up, avoiding known personal triggers, and mood monitoring (which allows early intervention).',
      },
      {
        heading: 'Identifying YOUR triggers',
        body: 'Population-level triggers are starting points. Your personal triggers may differ. This is exactly why consistent data tracking over months reveals patterns that would be invisible otherwise. Polar\'s pattern detection is built to surface your personal trigger-episode relationships, not generic ones.',
        callout: { type: 'tip', text: 'Use the Substance Log and Episode Memory together: over time, you will see whether and how your substance use correlates with your mood episodes. The data will tell you what the moment cannot.' },
      },
    ],
  },
  {
    slug: 'crisis-planning',
    title: 'Building Your Crisis Plan (WRAP)',
    category: 'crisis',
    readTime: 8,
    summary: 'How to build a Wellness Recovery Action Plan — a structured document you create when well that guides your care when you cannot think clearly.',
    lastReviewed: '2024-01',
    sources: [
      'Copeland (1997), Wellness Recovery Action Plan',
      'Cook et al. (2012), WRAP effectiveness in bipolar disorder',
      'SAMHSA WRAP guidelines',
    ],
    content: [
      {
        heading: 'What is a WRAP?',
        body: 'A Wellness Recovery Action Plan (WRAP) is a structured, personalized document developed when you are stable that contains: what you look like when well, your early warning signs, your crisis triggers, what actions to take at each stage, who has permission to make decisions for you if you cannot, and your advance directives. It was developed by mental health advocate Mary Ellen Copeland and has evidence for improving outcomes in serious mental illness.',
      },
      {
        heading: 'Section 1: What I look like when I\'m well',
        body: 'Describe in specific behavioral terms: how much sleep you get, how you interact with people, your energy level, your appetite, your productivity, your interests. This becomes the baseline against which changes are measured. Be specific — "I sleep 7.5 hours and wake up without an alarm" is more useful than "I sleep well."',
      },
      {
        heading: 'Section 2: Daily maintenance plan',
        body: 'What you need to do every day to stay well: medication times, sleep schedule, exercise, meals, connection with others, activities that keep you stable. Documenting this when well means you have a reference when you start to slip.',
      },
      {
        heading: 'Section 3: Triggers and early warning signs',
        body: 'List the external events and internal changes that precede your episodes. Polar\'s warning system is built to help you track these in real time. Document them here too, with specific actions to take at the first sign.',
        callout: { type: 'tip', text: 'Use Polar\'s WRAP Builder to create, store, and update your plan digitally. You can share it with your psychiatrist and trusted contacts.' },
      },
      {
        heading: 'Section 4: Crisis plan and advance directives',
        body: 'When you are no longer able to make safe decisions for yourself, this section tells others: who to call, where you want to be treated (or not treated), medications that have helped and not helped, things that make you feel better and worse, and who has authority to make decisions. This is the most important part and the one most people avoid writing. Do it when you are stable.',
        callout: { type: 'warning', text: 'Share your crisis plan with at least one trusted person and your psychiatrist BEFORE you need it. A plan that only you know about cannot help you in a crisis.' },
      },
    ],
  },
  {
    slug: 'relationships-and-bipolar',
    title: 'Bipolar Disorder and Relationships',
    category: 'relationships',
    readTime: 7,
    summary: 'How bipolar disorder affects relationships, what partners and family need to know, and communication strategies that actually work.',
    lastReviewed: '2024-01',
    sources: [
      'Miklowitz (2010), The Bipolar Disorder Survival Guide',
      'Granek et al. (2016), Impacts of bipolar disorder on relationships',
      'BAP guidelines — psychosocial aspects of bipolar disorder',
    ],
    content: [
      {
        heading: 'The honest picture',
        body: 'Bipolar disorder affects relationships significantly. Divorce rates are higher in bipolar disorder, as are relationship conflicts and caregiver burnout in partners. This is not destiny, but it is reality. Episodes can cause behavior that damages trust — impulsive decisions, withdrawal, irritability, hypersexuality during mania, complete shutdown during depression. The most protective factor for relationships is treatment adherence and honest communication.',
      },
      {
        heading: 'What your partner/family needs to understand',
        body: 'Episode behavior is driven by the illness, not by character. The person who spends recklessly during mania or disappears during depression is not the same as the person who is stable. Caregivers also need support — family therapy, support groups (NAMI Family Support Group), and psychoeducation significantly improve family outcomes. Caregiver burnout is real and must be actively prevented.',
      },
      {
        heading: 'How to talk about your diagnosis',
        body: 'There is no obligation to disclose to anyone. Disclosure to a partner, close friend, or family member can be valuable but should be a considered choice. When disclosing: choose a calm, private time (not during or immediately after an episode), lead with what you need from them, give them resources to learn, and give them time to process. The caregiver view in Polar is designed partly to make this easier — sharing data can replace abstract explanation.',
        callout: { type: 'tip', text: 'Sharing your Polar caregiver link with a trusted partner gives them real data without requiring you to explain everything in words. It can reduce the emotional load of "how are you really doing" conversations.' },
      },
    ],
  },
]

export const CATEGORIES = {
  understanding: { label: 'Understanding BD', color: '#6366f1', description: 'The science and clinical reality of bipolar disorder' },
  treatment: { label: 'Treatment', color: '#22c55e', description: 'Medications, therapy, and clinical interventions' },
  lifestyle: { label: 'Lifestyle', color: '#f59e0b', description: 'Sleep, triggers, exercise, and daily habits' },
  crisis: { label: 'Crisis & Planning', color: '#ef4444', description: 'Crisis resources, WRAP planning, advance directives' },
  relationships: { label: 'Relationships', color: '#8b5cf6', description: 'Family, partners, disclosure, and support' },
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.category === category)
}
