import { CityResolver } from '@web/modules/city/server/city.resolver';
import { CountryResolver } from '@web/modules/country/server/country.resolver';
import { FormDataResolver } from '@web/modules/formData/server/formData.resolver';
import { DocumentResolver } from '@web/modules/formsContentFiles/server/document.resolver';
import { ProfileResolver } from '@web/modules/profile/server/profile.resolver';
import { StateResolver } from '@web/modules/state/server/state.resolver';
import { SubmissionResolver } from '@web/modules/submission/server/data.resolver';
import { UploadResolver } from '@web/modules/upload/server/upload.resolver';
import { UserResolver } from '@web/modules/user/server/user.resolver';
import { EducationResolver } from '@web/modules/education/server/education.resolver';
import { CandidateSkillResolver } from '@web/modules/candidateSkills/server/candidateSkills.resolver';
import { NonEmptyArray } from 'type-graphql';

import { AchievementAwardResolver } from '@web/modules/achievementAward/server/achievementAward.resolver';
import { AssetResolver } from '@web/modules/asset/server/asset.resolver';
import { ViewerResolver } from '@web/modules/viewer/server/viewer.resolver';
import { WorkExperienceResolver } from '@web/modules/workExperience/server/workExperience.resolver';
import { AdditionalInfoResolver } from '@web/modules/additionalInfo/server/additionalInfo.resolver';
import { QuestionResolver } from '@web/modules/questions/server/questions.resolver';
import { QuestionaireAnsResolver } from '@web/modules/questionaireAnswer/server/questionaireAns.resolver';

export const resolvers: NonEmptyArray<Function> = [
	UserResolver,
	ProfileResolver,
	FormDataResolver,
	DocumentResolver,
	SubmissionResolver,
	UploadResolver,
	CountryResolver,
	CityResolver,
	StateResolver,
	EducationResolver,
	CandidateSkillResolver,
	AchievementAwardResolver,
	AssetResolver,
	ViewerResolver,
	WorkExperienceResolver,
	AdditionalInfoResolver,
	QuestionResolver,
	QuestionaireAnsResolver,
];
