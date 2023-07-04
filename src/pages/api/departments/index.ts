import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { departmentValidationSchema } from 'validationSchema/departments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDepartments();
    case 'POST':
      return createDepartment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDepartments() {
    const data = await prisma.department
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'department'));
    return res.status(200).json(data);
  }

  async function createDepartment() {
    await departmentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.department_user?.length > 0) {
      const create_department_user = body.department_user;
      body.department_user = {
        create: create_department_user,
      };
    } else {
      delete body.department_user;
    }
    const data = await prisma.department.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
