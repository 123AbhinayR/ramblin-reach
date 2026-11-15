import type {rankMatches} from "./rank";
export function personDto(person:ReturnType<typeof rankMatches>[number]){
 return {id:person.id,displayName:person.display_name,affiliation:person.affiliation,isDemo:person.is_demo,company:person.company_name,companyVerification:"self_reported",metro:person.metro,role:person.role_title,skills:person.skills,canTeach:person.can_teach,wantToLearn:person.want_learn,helpTopics:person.help_topics,available:person.available,remainingMonthlyRequests:person.remaining,reasons:person.reasons,projects:person.projects.map(project=>({id:project.id,title:project.title,summary:project.summary,skills:project.skills,resourceTags:project.resource_tags,lesson:project.one_lesson,isDemo:project.is_demo}))};
}
