import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, PieChart, CreditCard, MoreVertical, Plus, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export function Finances() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">Finanças</h1>
          <p className="text-on-surface-variant mt-1">Visão geral do seu fluxo de caixa e movimentações.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-surface-container-high text-on-surface px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-surface-container-high transition-colors text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="bg-primary text-on-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group border border-surface-container-high">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-primary/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Saldo Total</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">R$ 142.500,00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant mb-1">Rendimento (Mês)</span>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+2.4%</span>
                </div>
              </div>
              <div className="w-px h-8 bg-surface-container-high"></div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant mb-1">Receitas</span>
                <div className="flex items-center gap-1 text-primary">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="font-medium">R$ 45.200</span>
                </div>
              </div>
              <div className="w-px h-8 bg-surface-container-high"></div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant mb-1">Despesas</span>
                <div className="flex items-center gap-1 text-error">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="font-medium">R$ 12.800</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
          <h3 className="font-headline font-semibold text-lg mb-6 text-on-surface">Despesas por Categoria</h3>
          <div className="space-y-5">
            {[
              { name: 'Marketing', amount: 'R$ 4.500', percent: 45, color: 'bg-primary' },
              { name: 'Software', amount: 'R$ 2.100', percent: 25, color: 'bg-secondary' },
              { name: 'Equipamentos', amount: 'R$ 1.800', percent: 20, color: 'bg-tertiary' },
              { name: 'Outros', amount: 'R$ 900', percent: 10, color: 'bg-surface-variant' },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface">{cat.name}</span>
                  <span className="font-medium text-on-surface">{cat.amount}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart (Abstract) */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline font-semibold text-lg text-on-surface">Fluxo de Caixa</h3>
            <select className="bg-surface-container text-sm px-3 py-1.5 rounded-lg border border-surface-container-high outline-none text-on-surface-variant">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 85].map((height, i) => (
              <div key={i} className="w-full max-w-[40px] flex flex-col justify-end gap-2 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-md transition-all group-hover:bg-primary/40 relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md" style={{ height: '40%' }}></div>
                </div>
                <span className="text-xs text-center text-on-surface-variant">
                  {['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-semibold text-lg text-on-surface">Faturas Pendentes</h3>
            <button className="text-sm text-primary hover:underline">Ver todas</button>
          </div>
          
          <div className="space-y-4">
            {[
              { client: 'Synara Clinic', amount: 'R$ 3.500,00', due: 'Vence hoje', urgent: true },
              { client: 'Gaki USA', amount: 'R$ 8.200,00', due: 'Vence em 3 dias', urgent: false },
              { client: 'Onne Fit', amount: 'R$ 1.500,00', due: 'Vence em 5 dias', urgent: false },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/30 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-on-surface">{invoice.client}</p>
                  <p className={cn("text-xs mt-0.5", invoice.urgent ? "text-error font-medium" : "text-on-surface-variant")}>
                    {invoice.due}
                  </p>
                </div>
                <span className="text-sm font-bold text-on-surface">{invoice.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 rounded-xl border border-dashed border-surface-container-high text-on-surface-variant text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Nova Fatura
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-semibold text-lg text-on-surface">Transações Recentes</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-sm font-medium border border-surface-container-high hover:bg-surface-container-high transition-colors">Todas</button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors">Entradas</button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors">Saídas</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container-high">
                <th className="pb-3 font-medium px-4">Descrição</th>
                <th className="pb-3 font-medium px-4">Data</th>
                <th className="pb-3 font-medium px-4">Categoria</th>
                <th className="pb-3 font-medium px-4">Status</th>
                <th className="pb-3 font-medium px-4 text-right">Valor</th>
                <th className="pb-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {[
                { desc: 'Pagamento Projeto Synara', date: 'Hoje, 14:30', cat: 'Serviços', status: 'Concluído', val: '+ R$ 15.000,00', type: 'in' },
                { desc: 'Assinatura Adobe CC', date: 'Ontem, 09:15', cat: 'Software', status: 'Concluído', val: '- R$ 289,00', type: 'out' },
                { desc: 'Consultoria Gaki USA', date: '12 Mar, 16:00', cat: 'Serviços', status: 'Pendente', val: '+ R$ 8.500,00', type: 'in' },
                { desc: 'Compra Equipamentos', date: '10 Mar, 11:20', cat: 'Equipamentos', status: 'Concluído', val: '- R$ 4.200,00', type: 'out' },
                { desc: 'Pagamento Semeia', date: '05 Mar, 10:00', cat: 'Serviços', status: 'Concluído', val: '+ R$ 5.000,00', type: 'in' },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-surface-container transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", tx.type === 'in' ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant')}>
                        {tx.type === 'in' ? <ArrowUpRight className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <span className="font-medium text-on-surface whitespace-nowrap">{tx.desc}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-on-surface-variant whitespace-nowrap">{tx.date}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-xs border border-surface-container-high whitespace-nowrap">
                      {tx.cat}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                      tx.status === 'Concluído' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={cn("py-4 px-4 text-right font-medium whitespace-nowrap", tx.type === 'in' ? 'text-primary' : 'text-on-surface')}>
                    {tx.val}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
