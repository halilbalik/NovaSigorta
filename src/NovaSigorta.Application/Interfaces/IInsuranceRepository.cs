using NovaSigorta.Domain.Entities;

namespace NovaSigorta.Application.Interfaces;

public interface IInsuranceRepository : IGenericRepository<Insurance>
{
    Task<IEnumerable<Insurance>> GetActiveInsurancesAsync();
    Task<Insurance?> GetInsuranceWithApplicationsAsync(int id);
}
