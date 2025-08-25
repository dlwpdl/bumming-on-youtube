import { useState } from 'react';
import { AdvancedChannelData, ChannelSortField, SortOrder } from '@/lib/types';
import { 
  getGradeColor, 
  formatGrowthNumber, 
  getGrowthRateColor, 
  formatUploadFrequency,
  getCountryFlag 
} from '@/lib/channelUtils';
import { ChevronDown, ChevronUp, ExternalLink, Play } from 'lucide-react';

interface AdvancedChannelTableProps {
  channels: AdvancedChannelData[];
  sortField: ChannelSortField;
  sortOrder: SortOrder;
  onSort: (field: ChannelSortField) => void;
  onSearchChannelVideos?: (channelId: string, channelTitle: string) => void;
  loading?: boolean;
  tableSize?: 'compact' | 'normal' | 'spacious';
}

export default function AdvancedChannelTable({ 
  channels, 
  sortField, 
  sortOrder, 
  onSort, 
  onSearchChannelVideos,
  loading = false,
  tableSize = 'normal'
}: AdvancedChannelTableProps) {
  const getSortIcon = (field: ChannelSortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const openChannelInNewTab = (channelId: string) => {
    window.open(`https://www.youtube.com/channel/${channelId}`, '_blank');
  };

  // 테이블 크기에 따른 스타일링
  const getTableSizeClasses = () => {
    switch (tableSize) {
      case 'compact':
        return {
          headerPadding: 'px-3 py-2',
          cellPadding: 'px-3 py-2',
          textSize: 'text-xs',
          minHeight: 'min-h-[40px]'
        };
      case 'spacious':
        return {
          headerPadding: 'px-6 py-5',
          cellPadding: 'px-6 py-4',
          textSize: 'text-base',
          minHeight: 'min-h-[80px]'
        };
      default: // normal
        return {
          headerPadding: 'px-4 py-3',
          cellPadding: 'px-4 py-3',
          textSize: 'text-sm',
          minHeight: 'min-h-[60px]'
        };
    }
  };

  const sizeClasses = getTableSizeClasses();

  // 성장률 표시 함수
  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    const color = rate >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={color}>
        {sign}{formatNumber(rate)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="neo-glass cyber-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">채널 데이터를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="neo-glass cyber-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto mobile:overflow-x-scroll">
          <table className={`w-full ${sizeClasses.textSize} text-gray-100 min-w-[1800px] mobile:min-w-[800px]`}>
          <thead className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-b-2 border-cyan-400/40 backdrop-blur-sm">
            <tr>
              <th className={`${sizeClasses.headerPadding} text-left font-bold text-cyan-200 w-16`}>#</th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-left font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 w-20 transition-all duration-200`}
                onClick={() => onSort('grade')}
                title="등급별 정렬: S(1천만+) > A(500만+) > B+(100만+) > B(50만+) > B-(10만+) > C+(5만+) > C(1만+) > C-(5천+) > D+(1천+) > D(1천 미만)"
              >
                <div className="flex items-center gap-2">
                  등급 {getSortIcon('grade')}
                </div>
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-center font-bold text-cyan-200 w-24`}>
                영상찾기
              </th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-left font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 min-w-48 transition-all duration-200`}
                onClick={() => onSort('title')}
              >
                <div className="flex items-center gap-2">
                  채널명 {getSortIcon('title')}
                </div>
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-left font-bold text-cyan-200 w-20`}>주제</th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-right font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 w-32 transition-all duration-200`}
                onClick={() => onSort('subscriberCount')}
              >
                <div className="flex items-center justify-end gap-2">
                  구독자수 {getSortIcon('subscriberCount')}
                </div>
              </th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-right font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 w-24 transition-all duration-200`}
                onClick={() => onSort('videoCount')}
              >
                <div className="flex items-center justify-end gap-2">
                  영상수 {getSortIcon('videoCount')}
                </div>
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-right font-bold text-orange-200 bg-gradient-to-b from-orange-500/20 to-orange-600/20 w-28`}>
                연간증가
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-right font-bold text-orange-200 bg-gradient-to-b from-orange-500/20 to-orange-600/20 w-24`}>
                월간증가
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-right font-bold text-orange-200 bg-gradient-to-b from-orange-500/20 to-orange-600/20 w-24`}>
                일간증가
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-right font-bold text-cyan-200 w-28`}>
                영상당증가
              </th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-center font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 w-24 transition-all duration-200`}
                onClick={() => onSort('publishedAt')}
              >
                <div className="flex items-center justify-center gap-2">
                  개설일 {getSortIcon('publishedAt')}
                </div>
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-center font-bold text-cyan-200 w-24`}>운영년수</th>
              
              <th className={`${sizeClasses.headerPadding} text-center font-bold text-cyan-200 w-28`}>업로드빈도</th>
              
              <th 
                className={`${sizeClasses.headerPadding} text-right font-bold text-cyan-200 cursor-pointer hover:bg-cyan-400/10 w-32 transition-all duration-200`}
                onClick={() => onSort('viewCount')}
              >
                <div className="flex items-center justify-end gap-2">
                  총조회수 {getSortIcon('viewCount')}
                </div>
              </th>
              
              <th className={`${sizeClasses.headerPadding} text-right font-bold text-cyan-200 w-32`}>평균조회수</th>
              
              <th className={`${sizeClasses.headerPadding} text-center font-bold text-cyan-200 w-20`}>위치</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-700/50 bg-gradient-to-b from-gray-900/40 to-gray-900/60">
            {channels.map((channel, index) => {
              const gradeColors = getGradeColor(channel.grade);
              
              return (
                <tr key={channel.id} className={`hover:bg-slate-700/30 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/5 group ${sizeClasses.minHeight} relative`}>
                  <td className={`${sizeClasses.cellPadding} text-gray-300 font-medium`}>{index + 1}</td>
                  
                  <td className={`${sizeClasses.cellPadding}`}>
                    <span 
                      className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${gradeColors.bg} ${gradeColors.text} border ${gradeColors.border} shadow-lg cursor-help`}
                      title={`${channel.grade}등급: ${
                        channel.grade === 'S' ? '1천만+ 구독자' :
                        channel.grade === 'A' ? '500만+ 구독자' :
                        channel.grade === 'B+' ? '100만+ 구독자' :
                        channel.grade === 'B' ? '50만+ 구독자' :
                        channel.grade === 'B-' ? '10만+ 구독자' :
                        channel.grade === 'C+' ? '5만+ 구독자' :
                        channel.grade === 'C' ? '1만+ 구독자' :
                        channel.grade === 'C-' ? '5천+ 구독자' :
                        channel.grade === 'D+' ? '1천+ 구독자' :
                        '1천 미만 구독자'
                      }`}
                    >
                      {channel.grade}
                    </span>
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding}`}>
                    {onSearchChannelVideos && (
                      <button
                        onClick={() => onSearchChannelVideos(channel.id, channel.title)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="이 채널의 영상들을 영상찾기 탭에서 보기"
                      >
                        <Play className="w-3 h-3" />
                        영상
                      </button>
                    )}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} min-w-48`}>
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:text-cyan-400 group-hover:scale-105 transition-all duration-200"
                      onClick={() => openChannelInNewTab(channel.id)}
                    >
                      <img 
                        src={channel.thumbnail} 
                        alt={channel.title} 
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-cyan-400/30 shadow-md"
                      />
                      <span className="font-semibold text-white truncate group-hover:text-cyan-400 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 rounded-lg group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-200 border border-blue-500/20">
                        {channel.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200" />
                    </div>
                  </td>
                  
                  {/* 전체 행에 대한 상세 정보 툴팁 */}
                  <td className="absolute left-0 top-full mt-2 pointer-events-none z-50">
                    <div className="bg-gray-800/98 border border-cyan-400/50 rounded-xl p-6 shadow-2xl min-w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-lg">
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        {/* 왼쪽 컬럼 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-bold text-cyan-400 text-base mb-4">
                            <img src={channel.thumbnail} alt={channel.title} className="w-8 h-8 rounded-full" />
                            <span className="truncate">{channel.title}</span>
                          </div>
                          <div className="text-gray-200">
                            <div className="mb-2"><strong className="text-cyan-300">설명:</strong> <span className="text-gray-300">{channel.description?.slice(0, 120)}...</span></div>
                            <div><strong className="text-cyan-300">구독자:</strong> <span className="text-white">{formatNumber(channel.subscriberCount)}명</span></div>
                            <div><strong className="text-cyan-300">총 영상:</strong> <span className="text-white">{formatNumber(channel.videoCount)}개</span></div>
                            <div><strong className="text-cyan-300">총 조회수:</strong> <span className="text-white">{formatNumber(channel.viewCount)}회</span></div>
                            <div><strong className="text-cyan-300">평균 조회수:</strong> <span className="text-white">{formatNumber(channel.averageViews)}회</span></div>
                            <div><strong className="text-cyan-300">개설일:</strong> <span className="text-white">{formatDate(channel.publishedAt)}</span></div>
                            <div><strong className="text-cyan-300">운영 기간:</strong> <span className="text-white">{channel.growthData.operatingYears}년</span></div>
                            <div><strong className="text-cyan-300">국가:</strong> <span className="text-white">{getCountryFlag(channel.country)} {channel.country || 'N/A'}</span></div>
                          </div>
                        </div>
                        
                        {/* 오른쪽 컬럼 - 성장 데이터 */}
                        <div className="space-y-3">
                          <div className="font-bold text-orange-400 text-base mb-4">📈 성장 분석</div>
                          <div className="text-gray-200">
                            <div><strong className="text-orange-300">연간 증가:</strong> {formatGrowthRate(channel.growthData.yearlyGrowth)}</div>
                            <div><strong className="text-orange-300">월간 증가:</strong> {formatGrowthRate(channel.growthData.monthlyGrowth)}</div>
                            <div><strong className="text-orange-300">일간 증가:</strong> {formatGrowthRate(channel.growthData.dailyGrowth)}</div>
                            <div><strong className="text-purple-300">영상당 구독자:</strong> <span className="text-white">{formatNumber(channel.growthData.subscribersPerVideo)}</span></div>
                            <div><strong className="text-purple-300">업로드 빈도:</strong> <span className="text-white">{formatUploadFrequency(channel.growthData.uploadFrequency)}</span></div>
                            <div className="mt-3 pt-2 border-t border-gray-600">
                              <div><strong className="text-cyan-300">등급:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded-lg text-sm font-bold ${getGradeColor(channel.grade).bg} ${getGradeColor(channel.grade).text} border ${getGradeColor(channel.grade).border}`}>
                                  {channel.grade}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding}`}>
                    <span className="inline-block bg-gradient-to-r from-gray-600/40 to-gray-700/40 text-gray-200 px-2 py-1 rounded-md text-sm border border-gray-500/30 font-medium">
                      {channel.category}
                    </span>
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right font-bold text-blue-300 bg-gradient-to-l from-blue-500/15 to-transparent`}>
                    {formatNumber(channel.subscriberCount)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right text-gray-200 font-medium`}>
                    {formatNumber(channel.videoCount)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right font-bold bg-gradient-to-l from-orange-500/15 to-transparent`}>
                    {formatGrowthRate(channel.growthData.yearlyGrowth)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right font-bold bg-gradient-to-l from-orange-500/15 to-transparent`}>
                    {formatGrowthRate(channel.growthData.monthlyGrowth)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right font-bold bg-gradient-to-l from-orange-500/15 to-transparent`}>
                    {formatGrowthRate(channel.growthData.dailyGrowth)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right text-gray-200 font-medium`}>
                    {formatNumber(channel.growthData.subscribersPerVideo)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-center text-gray-200 font-medium`}>
                    {formatDate(channel.publishedAt)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-center text-gray-200 font-medium`}>
                    {channel.growthData.operatingYears}년
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-center text-gray-200 font-medium`}>
                    {formatUploadFrequency(channel.growthData.uploadFrequency)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right text-gray-200 font-medium`}>
                    {formatNumber(channel.viewCount)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-right text-gray-200 font-medium`}>
                    {formatNumber(channel.averageViews)}
                  </td>
                  
                  <td className={`${sizeClasses.cellPadding} text-center`}>
                    <span title={channel.country || '알 수 없음'} className="text-xl hover:scale-110 transition-transform duration-200">
                      {getCountryFlag(channel.country)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {channels.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            검색된 채널이 없습니다.
          </div>
        )}
        </div>
      </div>
    </div>
  );
}