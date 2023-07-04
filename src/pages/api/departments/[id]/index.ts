import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { departmentValidationSchema } from 'validationSchema/departments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.department
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDepartmentById();
    case 'PUT':
      return updateDepartmentById();
    case 'DELETE':
      return deleteDepartmentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDepartmentById() {
    const data = await prisma.department.findFirst(convertQueryToPrismaUtil(req.query, 'department'));
    return res.status(200).json(data);
  }

  async function updateDepartmentById() {
    await departmentValidationSchema.validate(req.body);
    const data = await prisma.department.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteDepartmentById() {
    const data = await prisma.department.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
