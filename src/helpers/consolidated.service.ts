import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { parseToArray } from '../helpers';

@Injectable()
export class ConsolidatedService {
  async insertConsolidatedStudentPlanning(
    queryRunner: any,
    schoolPlanningId: number,
    planningId: number,
    schoolId: number,
    schoolGradeId: number,
  ) {
    return await queryRunner.manager.query(
      `INSERT INTO students_v1_db.student_plannings (
         schoolGradeId, planningId, schoolPlanningId, schoolId, createdAt, updatedAt
         )
       VALUES (
        ${schoolGradeId}, ${planningId}, ${schoolPlanningId}, ${schoolId}, NOW(), NOW()
         )`,
    );
  }

  async insertConsolidatedStudentPlanningDiscipline(
    queryRunner: any,
    planningDisciplines: any[],
    planningId: number,
  ) {
    const studentPlanning = (
      await queryRunner.manager.query(
        `SELECT sp.id FROM students_v1_db.student_plannings sp WHERE sp.planningId = ${planningId} AND sp.deletedAt is null`,
      )
    )[0];

    if (studentPlanning) {
      parseToArray(planningDisciplines).forEach(async (planningDiscipline) => {
        await queryRunner.manager.query(
          `INSERT INTO students_v1_db.student_planning_disciplines (
             name, shortname, studentPlanningId, themeId, groupId, planningDisciplineId, createdAt, updatedAt
             )
           VALUES (
            '${planningDiscipline.name}', '${planningDiscipline.shortname}', ${studentPlanning.id}, ${planningDiscipline.themeId}, ${planningDiscipline.groupId}, ${planningDiscipline.id}, NOW(), NOW()
             )`,
        );
      });
    }
  }

  async insertConsolidatedStudentPlanningChapter(
    queryRunner: any,
    planningChapters: any[],
    planningId: number,
  ) {
    const studentPlanning = (
      await queryRunner.manager.query(
        `SELECT sp.id FROM students_v1_db.student_plannings sp WHERE sp.planningId = ${planningId} AND sp.deletedAt is null`,
      )
    )[0];

    if (studentPlanning) {
      await Promise.all(
        planningChapters.map(async (planningChapter) => {
          const planningTemplateChapter = (
            await queryRunner.manager.query(
              `SELECT ptc.name, ptc.number FROM planning_v2_db.PlanningTemplateChapter ptc WHERE ptc.id = ${planningChapter.planningTemplateChapterId} AND ptc.deletedAt is null`,
            )
          )[0];

          if (planningTemplateChapter) {
            const studentPlanningChapters = await queryRunner.manager.query(
              `INSERT INTO students_v1_db.student_planning_chapters (
               name, number, studentPlanningId, planningTemplateChapterId, planningChapterId, startDate, endDate, createdAt, updatedAt
               )
             VALUES (
              '${planningTemplateChapter.name}', 
              ${planningTemplateChapter.number}, 
              ${studentPlanning.id}, 
              ${planningChapter.planningTemplateChapterId}, 
              ${planningChapter.id}, 
              '${planningChapter.startDate.toISOString()}', 
              '${planningChapter.endDate.toISOString()}', 
              NOW(), 
              NOW()
            )`,
            );

            const consolidatedStudentPlanningLesson =
              await this.insertConsolidatedStudentPlanningLesson(
                queryRunner,
                planningChapter.planningLessons,
                studentPlanning.id,
                studentPlanningChapters.insertId,
              );

            const consolidatedStudentPlanningApplication =
              await this.insertConsolidatedStudentPlanningApplication(
                queryRunner,
                planningChapter.planningApplications,
                studentPlanningChapters.insertId,
                planningId,
                studentPlanning.id,
              );

            return {
              consolidatedStudentPlanningLesson,
              consolidatedStudentPlanningApplication,
            };
          }
        }),
      );
    }
  }

  private async insertConsolidatedStudentPlanningLesson(
    queryRunner: any,
    planningLessons: any[],
    studentPlanningId: number,
    studentPlanningChaptersId: number,
  ) {
    if (planningLessons.length > 0) {
      await Promise.all(
        planningLessons.map(async (planningLesson) => {
          const planningTemplateLesson = (
            await queryRunner.manager.query(
              `SELECT ptl.name, ptl.description FROM planning_v2_db.PlanningTemplateLesson ptl WHERE ptl.id = ${planningLesson.planningTemplateLessonId} AND ptl.deletedAt is null`,
            )
          )[0];

          if (planningTemplateLesson) {
            const planningTemplateDisciplinePlanning = (
              await queryRunner.manager.query(
                `SELECT ptdp.planningDisciplineId FROM planning_v2_db.PlanningTemplateDisciplinePlanning ptdp WHERE ptdp.id = ${planningLesson.planningTemplateDisciplinePlanningId} AND ptdp.deletedAt is null`,
              )
            )[0];

            const studentPlanningDiscipline = (
              await queryRunner.manager.query(
                `SELECT spd.id FROM students_v1_db.student_planning_disciplines spd WHERE spd.planningDisciplineId = ${planningTemplateDisciplinePlanning.planningDisciplineId} AND spd.studentPlanningId = ${studentPlanningId}`,
              )
            )[0];

            return await queryRunner.manager.query(
              `INSERT INTO students_v1_db.student_planning_lessons (
                    planningLessonId, studentPlanningDisciplineId, studentPlanningId, startDate, endDate, studentPlanningChapterId, planningTemplateLessonId, name, description, createdAt, updatedAt
                   )
                 VALUES (
                  ${planningLesson.id},  
                  ${
                    studentPlanningDiscipline
                      ? studentPlanningDiscipline.id
                      : null
                  }, 
                  ${studentPlanningId}, 
                  '${planningLesson.startDate.toISOString()}', 
                  '${planningLesson.endDate.toISOString()}', 
                  ${studentPlanningChaptersId}, 
                  ${planningLesson.planningTemplateLessonId}, 
                  '${planningTemplateLesson.name}', 
                  '${planningTemplateLesson.description}', 
                  NOW(), 
                  NOW()
                   )`,
            );
          }
        }),
      );
    }
  }

  async insertConsolidatedStudentPlanningApplication(
    queryRunner: any,
    planningApplications: any[],
    studentPlanningChaptersId: number,
    planningId?: number,
    studentPlanningId?: number,
  ) {
    if (planningApplications.length > 0) {
      let studentPlanning;

      if (!studentPlanningId) {
        studentPlanning = (
          await queryRunner.manager.query(
            `SELECT sp.id FROM students_v1_db.student_plannings sp WHERE sp.planningId = ${planningId} AND sp.deletedAt is null`,
          )
        )[0];
      }

      await Promise.all(
        planningApplications.map(async (planningApplication) => {
          const planningTemplateApplication = (
            await queryRunner.manager.query(
              `SELECT pta.id, pta.instrumentQuestionGroupId, pta.planningTemplateInstrumentId FROM planning_v2_db.PlanningTemplateApplication pta WHERE pta.id = ${planningApplication.planningTemplateApplicationId} AND pta.deletedAt is null`,
            )
          )[0];

          const planningTemplateInstrument = (
            await queryRunner.manager.query(
              `SELECT pti.instrumentId FROM planning_v2_db.PlanningTemplateInstrument pti WHERE pti.id = ${planningTemplateApplication.planningTemplateInstrumentId} AND pti.deletedAt is null`,
            )
          )[0];

          return await queryRunner.manager.query(
            `INSERT INTO students_v1_db.student_planning_applications (
                    planningApplicationId, studentPlanningId, studentPlanningChapterId, startDate, endDate, planningTemplateApplicationId, instrumentQuestionGroupId, instrumentId, createdAt, updatedAt
                   )
                 VALUES (
                  ${planningApplication.id},  
                  ${studentPlanningId ? studentPlanningId : studentPlanning.id},
                  ${studentPlanningChaptersId},
                  '${planningApplication.startDate.toISOString()}', 
                  '${planningApplication.endDate.toISOString()}', 
                  ${planningTemplateApplication.id},
                  ${planningTemplateApplication.instrumentQuestionGroupId},
                  ${planningTemplateInstrument.instrumentId},
                  NOW(), 
                  NOW()
                   )`,
          );
        }),
      );
    }
  }

  async procedureUpdateConsolidatedMap(
    queryRunner: any,
    schoolPlanningId: number,
  ) {
    await queryRunner.manager.query(
      `CALL students_v1_db.Update_StudentPlanning_From_SchoolPlanning(${schoolPlanningId}, @Error);`,
    );
  }

  async procedureDeleteConsolidatedMap(
    queryRunner: any,
    schoolPlanningId: number,
  ) {
    await queryRunner.manager.query(
      `CALL students_v1_db.Delete_StudentPlanning_From_SchoolPlanning(${schoolPlanningId}, @Error);`,
    );
  }
}
