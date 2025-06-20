import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

export default function LowVoltageEngineeringApp() {
  const [footage, setFootage] = useState(200);
  const [type, setType] = useState('EMT');
  const [location, setLocation] = useState('Indoor');
  const [size, setSize] = useState('0.75');
  const [bends, setBends] = useState(6);
  const [crewSize, setCrewSize] = useState(2);
  const [laborRate, setLaborRate] = useState(65);
  const [complexity, setComplexity] = useState('Standard');
  const [prices, setPrices] = useState({
    strap: 0.42,
    strapPack: 4.18,
    pullBox: 10.98,
    connector: 1.97,
    coupling: 0.90,
    elbow: 1.52,
    bushing: 0.55,
  });
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function fetchLatestPrices() {
      const updatedPrices = {
        strap: 0.42,
        strapPack: 4.18,
        pullBox: 10.98,
        connector: 1.97,
        coupling: 0.90,
        elbow: 1.52,
        bushing: 0.55,
      };
      setPrices(updatedPrices);
    }
    fetchLatestPrices();
  }, []);

  const getLaborRatePer100Ft = () => {
    switch (complexity) {
      case 'Light': return 4.5;
      case 'Complex': return 9.0;
      default: return 6.0;
    }
  };

  const calculateMaterials = () => {
    const maxBendsPerRun = 4;
    const pullBoxes = Math.ceil(bends / maxBendsPerRun) + Math.ceil(footage / 100);
    const straps = location === 'Indoor' ? Math.ceil(footage / 10) : Math.ceil(footage / 3);
    const strapPacks = Math.ceil(straps / 10);
    const connectors = pullBoxes * 2;
    const couplings = Math.max(Math.ceil(footage / 10) - 1, 0);
    const elbows = bends;
    const bushings = pullBoxes * 2;

    const laborRatePer100Ft = getLaborRatePer100Ft();
    const totalLaborHours = (footage / 100) * laborRatePer100Ft;
    const laborHoursPerPerson = (totalLaborHours / crewSize).toFixed(2);
    const laborCost = (totalLaborHours * laborRate).toFixed(2);

    const materialCost = 
      (straps * prices.strap) +
      (strapPacks * prices.strapPack) +
      (pullBoxes * prices.pullBox) +
      (connectors * prices.connector) +
      (couplings * prices.coupling) +
      (elbows * prices.elbow) +
      (bushings * prices.bushing);

    const totalCost = (materialCost + parseFloat(laborCost)).toFixed(2);

    setResults({
      straps, strapPacks, pullBoxes, connectors, couplings, elbows, bushings,
      totalLaborHours: totalLaborHours.toFixed(2),
      laborHoursPerPerson,
      laborCost,
      materialCost: materialCost.toFixed(2),
      totalCost
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-b from-blue-100 via-gray-100 to-blue-200 text-gray-900 rounded-xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Low Voltage Engineering</h1>
      <p className="mb-6 text-gray-700">A comprehensive toolkit for conduit and low voltage system estimations.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Total Footage</label>
          <Input className="bg-white text-black" type="number" value={footage} onChange={e => setFootage(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Conduit Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-white text-black">{type}</SelectTrigger>
            <SelectContent>
              <SelectItem value="EMT">EMT</SelectItem>
              <SelectItem value="PVC">PVC</SelectItem>
              <SelectItem value="RMC">RMC</SelectItem>
              <SelectItem value="FMC">FMC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="bg-white text-black">{location}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Indoor">Indoor</SelectItem>
              <SelectItem value="Outdoor">Outdoor</SelectItem>
              <SelectItem value="Underground">Underground</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Size (inches)</label>
          <Input className="bg-white text-black" value={size} onChange={e => setSize(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Number of Bends</label>
          <Input className="bg-white text-black" type="number" value={bends} onChange={e => setBends(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Crew Size (People)</label>
          <Input className="bg-white text-black" type="number" value={crewSize} onChange={e => setCrewSize(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Labor Rate ($/hr)</label>
          <Input className="bg-white text-black" type="number" value={laborRate} onChange={e => setLaborRate(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Install Complexity</label>
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger className="bg-white text-black">{complexity}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Light">Light (4.5 hrs/100 ft)</SelectItem>
              <SelectItem value="Standard">Standard (6.0 hrs/100 ft)</SelectItem>
              <SelectItem value="Complex">Complex (9.0 hrs/100 ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={calculateMaterials}>Calculate</Button>

      {results && (
        <Card className="mt-6 bg-white text-black border border-blue-400">
          <CardContent>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Materials & Labor Estimate</h2>
            <ul className="space-y-1">
              <li>Straps: {results.straps}</li>
              <li>Strap Packs (10/pack): {results.strapPacks}</li>
              <li>Pull Boxes: {results.pullBoxes}</li>
              <li>Connectors: {results.connectors}</li>
              <li>Couplings: {results.couplings}</li>
              <li>Elbows: {results.elbows}</li>
              <li>Bushings: {results.bushings}</li>
              <li className="font-medium">Material Cost: ${results.materialCost}</li>
              <li className="mt-3 font-semibold text-blue-700">Labor:</li>
              <li>Total Labor Hours: {results.totalLaborHours} hrs</li>
              <li>Labor Hours Per Person: {results.laborHoursPerPerson} hrs</li>
              <li>Labor Cost: ${results.laborCost}</li>
              <li className="font-bold text-blue-800 mt-2">Estimated Total Cost: ${results.totalCost}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
