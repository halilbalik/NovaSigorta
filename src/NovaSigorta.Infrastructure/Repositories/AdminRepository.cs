using Microsoft.EntityFrameworkCore;
using NovaSigorta.Application.Interfaces;
using NovaSigorta.Domain.Entities;
using NovaSigorta.Infrastructure.Data;

namespace NovaSigorta.Infrastructure.Repositories;

public class AdminRepository : GenericRepository<Admin>, IAdminRepository
{
    public AdminRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Admin?> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.Username == username);
    }
}
