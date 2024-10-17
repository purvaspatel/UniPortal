import React from 'react';

const TimeTable = ({ availableSlots }) => {
  const timeSlots = [
    "9-10",
    "10-11",
    "11-12",
    "12-1",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
  ];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          {/* Header row with time slots */}
          <thead>
            <tr>
              <th className="w-20 border border-gray-200 bg-gray-50 p-3"></th>
              {timeSlots.map((time) => (
                <th 
                  key={time}
                  className="w-24 border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body with days and slots */}
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td className="border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 text-center">
                  {day}
                </td>
                {timeSlots.map((time) => (
                  <td
                    key={`${day}-${time}`}
                    className={`border border-gray-200 p-3 text-center h-12
                      ${availableSlots[day]?.includes(time)
                        ? 'bg-green-50'
                        : 'bg-white'
                      }`}
                  >
                    {availableSlots[day]?.includes(time) && (
                      <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTable;