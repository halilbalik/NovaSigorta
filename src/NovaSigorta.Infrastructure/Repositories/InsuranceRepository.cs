using Microsoft.EntityFrameworkCore;
using NovaSigorta.Application.Interfaces;
using NovaSigorta.Domain.Entities;
using NovaSigorta.Infrastructure.Data;

namespace NovaSigorta.Infrastructure.Repositories;

public class InsuranceRepository : GenericRepository<Insurance>, IInsuranceRepository
{
    public InsuranceRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Insurance>> GetActiveInsurancesAsync()
    {
        return await _dbSet.Where(x => x.IsActive).OrderBy(x => x.Name).ToListAsync();
    }

    public async Task<Insurance?> GetInsuranceWithApplicationsAsync(int id)
    {
        return await _dbSet
            .Include(x => x.Applications)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
