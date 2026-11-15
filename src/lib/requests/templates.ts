export const QUICK_REASONS = ['Career Question','Coffee Chat','Resume Review','Mock Interview','Project Feedback','Technical Mentoring','General Connection','Quick Question'] as const;
export function quickTemplate(reason:typeof QUICK_REASONS[number]){
 const questions:Record<typeof QUICK_REASONS[number],string>={
 'Career Question':'Could you share advice on a career question I am exploring?',
 'Coffee Chat':'Would you be open to a short conversation about the topic I describe above?',
 'Resume Review':'Would you review one part of my resume and suggest what I could clarify?',
 'Mock Interview':'Would you help me practice an interview question and share feedback?',
 'Project Feedback':'Could you give feedback on the project question I describe above?',
 'Technical Mentoring':'Could you help me think through a technical question and a useful next step?',
 'General Connection':'Would you be open to connecting about the topic I describe above?',
 'Quick Question':'Could you help with the specific question I describe in my goal?'
 };return {goal:'I would appreciate guidance on a topic you offer.',question:questions[reason]};
}
