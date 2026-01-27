import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SkillNode, SkillLink, SkillStatus } from '../../types';

interface ContextGraphProps {
    nodes: SkillNode[];
    links: SkillLink[];
    onNodeClick?: (node: SkillNode) => void;
    highlightDecaying?: boolean;
}

const ContextGraph: React.FC<ContextGraphProps> = ({
    nodes,
    links,
    onNodeClick,
    highlightDecaying = true,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !wrapperRef.current || nodes.length === 0) return;

        const width = wrapperRef.current.clientWidth;
        const height = 450;

        // Clear previous
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // Gradient definitions for glow effects
        const defs = svg.append('defs');

        // Create gradient for each status type
        const statusColors: Record<SkillStatus, string> = {
            ACTIVE: '#10B981',
            MASTERED: '#3B82F6',
            DORMANT: '#F59E0B',
            DECAYING: '#EF4444',
        };

        Object.entries(statusColors).forEach(([status, color]) => {
            const gradient = defs
                .append('radialGradient')
                .attr('id', `glow-${status}`)
                .attr('cx', '50%')
                .attr('cy', '50%')
                .attr('r', '50%');

            gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 1);
            gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.3);
        });

        // Color scale based on group
        const groupColors: Record<string, string> = {
            CORE: '#3B82F6',
            TECHNICAL: '#10B981',
            SOFT: '#8B5CF6',
            DOMAIN: '#F59E0B',
        };

        // Process links to reference node objects
        const nodeById = new Map(nodes.map((n) => [n.id, n]));
        const processedLinks = links.map((l) => ({
            ...l,
            source: nodeById.get(l.source as string) || l.source,
            target: nodeById.get(l.target as string) || l.target,
        }));

        // Create force simulation
        const simulation = d3
            .forceSimulation(nodes as any)
            .force(
                'link',
                d3
                    .forceLink(processedLinks)
                    .id((d: any) => d.id)
                    .distance(120)
                    .strength(0.5)
            )
            .force('charge', d3.forceManyBody().strength(-400))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(50));

        // Draw links
        const link = svg
            .append('g')
            .selectAll('line')
            .data(processedLinks)
            .join('line')
            .attr('stroke', '#475569')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', (d) => Math.sqrt(d.strength) * 0.8);

        // Create node groups
        const nodeGroup = svg
            .append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('cursor', 'pointer')
            .call(drag(simulation) as any);

        // Decay ring (background)
        nodeGroup
            .append('circle')
            .attr('r', (d) => d.proficiency * 6 + 12)
            .attr('fill', 'none')
            .attr('stroke', (d) => (d.status === 'DECAYING' ? '#EF4444' : 'transparent'))
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '4 2')
            .attr('opacity', 0.5)
            .attr('class', (d) => (d.status === 'DECAYING' ? 'animate-pulse' : ''));

        // Main node circle
        nodeGroup
            .append('circle')
            .attr('r', (d) => d.proficiency * 5 + 8)
            .attr('fill', (d) => groupColors[d.group] || '#64748B')
            .attr('stroke', '#1E293B')
            .attr('stroke-width', 2)
            .attr('opacity', (d) => {
                if (d.status === 'DECAYING') return 0.5;
                if (d.status === 'DORMANT') return 0.6;
                return 1;
            })
            .attr('filter', (d) => (d.status === 'MASTERED' ? 'url(#glow-MASTERED)' : 'none'));

        // Decay percentage indicator (arc)
        nodeGroup.each(function (d) {
            if (d.decayPercentage > 0 && d.id !== 'user') {
                const radius = d.proficiency * 5 + 8;
                const arc = d3
                    .arc<any>()
                    .innerRadius(radius + 2)
                    .outerRadius(radius + 5)
                    .startAngle(0)
                    .endAngle((d.decayPercentage / 100) * 2 * Math.PI);

                d3.select(this)
                    .append('path')
                    .attr('d', arc as any)
                    .attr('fill', d.decayPercentage > 50 ? '#EF4444' : d.decayPercentage > 25 ? '#F59E0B' : '#10B981');
            }
        });

        // Labels
        nodeGroup
            .append('text')
            .text((d) => d.name)
            .attr('font-size', '11px')
            .attr('font-weight', (d) => (d.id === 'user' ? 'bold' : 'normal'))
            .attr('fill', '#E2E8F0')
            .attr('text-anchor', 'middle')
            .attr('dy', (d) => d.proficiency * 5 + 22);

        // Proficiency label
        nodeGroup
            .filter((d) => d.id !== 'user')
            .append('text')
            .text((d) => `L${d.proficiency}`)
            .attr('font-size', '9px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1E293B')
            .attr('text-anchor', 'middle')
            .attr('dy', 3);

        // Market demand indicator
        nodeGroup
            .filter((d) => d.marketDemand === 'CRITICAL' || d.marketDemand === 'HIGH')
            .append('circle')
            .attr('r', 4)
            .attr('fill', (d) => (d.marketDemand === 'CRITICAL' ? '#EF4444' : '#F59E0B'))
            .attr('cx', (d) => d.proficiency * 5 + 5)
            .attr('cy', (d) => -(d.proficiency * 5 + 5))
            .attr('stroke', '#1E293B')
            .attr('stroke-width', 1);

        // Tooltip interactions
        nodeGroup
            .on('mouseenter', function (event, d) {
                if (tooltipRef.current) {
                    const tooltip = tooltipRef.current;
                    tooltip.innerHTML = `
            <div class="font-semibold">${d.name}</div>
            <div class="text-xs text-slate-400 mt-1">
              Proficiency: ${d.proficiency}/5<br/>
              Status: ${d.status}<br/>
              ${d.decayPercentage > 0 ? `Decay: ${d.decayPercentage}%<br/>` : ''}
              Market: ${d.marketDemand}<br/>
              Verified: ${d.verificationSource}
            </div>
          `;
                    tooltip.style.opacity = '1';
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY - 10}px`;
                }
            })
            .on('mouseleave', function () {
                if (tooltipRef.current) {
                    tooltipRef.current.style.opacity = '0';
                }
            })
            .on('click', function (event, d) {
                onNodeClick?.(d);
            });

        // Simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        function drag(simulation: d3.Simulation<any, undefined>) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [nodes, links, onNodeClick, highlightDecaying]);

    return (
        <div className="relative">
            <div
                ref={wrapperRef}
                className="w-full bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-inner"
            >
                <svg ref={svgRef}></svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="text-slate-400">Technical</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                    <span className="text-slate-400">Soft Skills</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#EF4444]" />
                    <span className="text-slate-400">Decaying</span>
                </div>
            </div>

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                className="fixed z-50 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm pointer-events-none transition-opacity duration-200"
                style={{ opacity: 0 }}
            />
        </div>
    );
};

export default ContextGraph;
