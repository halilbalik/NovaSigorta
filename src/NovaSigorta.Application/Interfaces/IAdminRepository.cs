using NovaSigorta.Domain.Entities;

namespace NovaSigorta.Application.Interfaces;

public interface IAdminRepository : IGenericRepository<Admin>
{
    Task<Admin?> GetByUsernameAsync(string username);
}
