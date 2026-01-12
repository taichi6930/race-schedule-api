import 'reflect-metadata';

import type { Course } from '@race-schedule/shared/src/types/course';
import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { inject, injectable } from 'tsyringe';

import { ICourseUsecase } from '../usecase/interface/ICourseUsecase';

@injectable()
export class CourseController {
    public constructor(
        @inject('CourseUsecase')
        private readonly usecase: ICourseUsecase,
    ) {}

    /**
     * コース一覧を取得する
     * query param: course_code_type (可変、複数指定可)
     */
    public async get(searchParams: URLSearchParams): Promise<Response> {
        try {
            const rawTypes = searchParams.getAll('course_code_type');
            if (rawTypes.length === 0) {
                return Response.json(
                    { error: 'course_code_type を1つ以上指定してください' },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }
            const courseCodeTypeList: (typeof CourseCodeType)[keyof typeof CourseCodeType][] =
                rawTypes.filter((v) =>
                    Object.values(CourseCodeType).includes(v as any),
                ) as any;

            const courses: Course[] =
                await this.usecase.fetch(courseCodeTypeList);

            return Response.json(
                {
                    count: courses.length,
                    courses,
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        } catch (error) {
            console.error('Error in getCourseList:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}
