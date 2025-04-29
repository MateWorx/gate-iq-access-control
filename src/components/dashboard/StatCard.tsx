
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className = '' 
}) => {
  return (
    <div className={`card-stat ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-navy/10 text-navy">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs ${trend.isPositive ? 'text-lime-dark' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
