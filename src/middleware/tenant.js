const prisma = require('../config/database');

function tenantMiddleware(req, res, next) {
  if (!req.user || !req.user.tenantId) {
    return res.status(403).json({ error: 'Tenant não identificado' });
  }

  req.tenantId = req.user.tenantId;
  
  const originalPrismaQuery = prisma.$use;
  
  req.prisma = new Proxy(prisma, {
    get(target, prop) {
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return new Proxy(target[prop], {
          get(model, method) {
            if (typeof model[method] === 'function') {
              return function(...args) {
                const [params] = args;
                if (params && typeof params === 'object') {
                  if (method === 'create' || method === 'createMany') {
                    if (params.data) {
                      if (Array.isArray(params.data)) {
                        params.data = params.data.map(item => ({
                          ...item,
                          tenantId: req.tenantId
                        }));
                      } else {
                        params.data = {
                          ...params.data,
                          tenantId: req.tenantId
                        };
                      }
                    }
                  } else {
                    params.where = {
                      ...params.where,
                      tenantId: req.tenantId
                    };
                  }
                }
                return model[method].apply(model, args);
              };
            }
            return model[method];
          }
        });
      }
      return target[prop];
    }
  });

  next();
}

module.exports = tenantMiddleware;