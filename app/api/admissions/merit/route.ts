import { NextResponse } from 'next/server'

// Calculate merit score
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (typeof body.matricPercentage !== 'number' || 
        typeof body.intermediatePercentage !== 'number') {
      return NextResponse.json(
        { error: 'Matric and Intermediate percentages are required' },
        { status: 400 }
      )
    }
    
    // Validate percentage ranges
    if (body.matricPercentage < 0 || body.matricPercentage > 100 ||
        body.intermediatePercentage < 0 || body.intermediatePercentage > 100) {
      return NextResponse.json(
        { error: 'Percentages must be between 0 and 100' },
        { status: 400 }
      )
    }
    
    // Optional NTS score validation
    if (body.ntsScore !== undefined && 
        (typeof body.ntsScore !== 'number' || body.ntsScore < 0 || body.ntsScore > 100)) {
      return NextResponse.json(
        { error: 'NTS score must be between 0 and 100' },
        { status: 400 }
      )
    }

    // COMSATS merit calculation formula (simplified mock version)
    // Actual formula may vary by campus/program
    // This is a simplified example:
    // Merit = (Matric * 0.10) + (Intermediate * 0.40) + (NTS * 0.50)
    
    let meritScore: number;
    
    if (body.ntsScore !== undefined) {
      // If NTS score is provided, use the full formula
      meritScore = (
        (body.matricPercentage * 0.10) + 
        (body.intermediatePercentage * 0.40) + 
        (body.ntsScore * 0.50)
      );
    } else {
      // If no NTS score, use matric and intermediate only
      // This might be for programs that don't require NTS
      meritScore = (
        (body.matricPercentage * 0.20) + 
        (body.intermediatePercentage * 0.80)
      );
    }
    
    // Round to 2 decimal places
    meritScore = Math.round(meritScore * 100) / 100;
    
    // Mock historical data for comparison
    const mockHistoricalData = {
      lastYearCutoff: 72.5,
      threeYearAverage: 70.2,
      highestMerit: 95.8,
      lowestMerit: 65.0
    };
    
    // Determine admission likelihood based on merit score
    let likelihood: string;
    if (meritScore >= mockHistoricalData.lastYearCutoff + 5) {
      likelihood = 'Very High';
    } else if (meritScore >= mockHistoricalData.lastYearCutoff) {
      likelihood = 'High';
    } else if (meritScore >= mockHistoricalData.lastYearCutoff - 5) {
      likelihood = 'Moderate';
    } else if (meritScore >= mockHistoricalData.lowestMerit) {
      likelihood = 'Low';
    } else {
      likelihood = 'Very Low';
    }
    
    return NextResponse.json({
      meritScore,
      likelihood,
      historicalData: mockHistoricalData,
      message: `Based on the provided scores, your estimated merit is ${meritScore}%. Admission likelihood: ${likelihood}.`
    });
  } catch (error) {
    console.error('Error calculating merit:', error);
    return NextResponse.json(
      { error: 'Failed to calculate merit score' },
      { status: 500 }
    );
  }
}

// Get merit calculation guidelines
export async function GET() {
  try {
    // Mock guidelines data
    const guidelines = {
      title: "COMSATS Merit Calculation Guidelines",
      description: "Understanding how admission merit is calculated at COMSATS University",
      formulaExplanation: "Merit score is calculated based on academic performance and entrance test scores",
      weightage: [
        {
          component: "Matriculation/O-Level",
          weight: "10%",
          description: "Marks obtained in Matriculation or O-Level examinations"
        },
        {
          component: "Intermediate/A-Level",
          weight: "40%",
          description: "Marks obtained in Intermediate or A-Level examinations"
        },
        {
          component: "NTS/Entry Test",
          weight: "50%",
          description: "Score obtained in National Testing Service or university entry test"
        }
      ],
      importantNotes: [
        "Weightage may vary by campus and program",
        "Some programs may not require an entrance test",
        "Aggregate score is calculated out of 100",
        "Minimum eligibility criteria must be met for application"
      ],
      disclaimer: "These are general guidelines. Actual merit calculation may vary. Please refer to the official COMSATS website for the most accurate information."
    };
    
    return NextResponse.json(guidelines);
  } catch (error) {
    console.error('Error fetching merit guidelines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merit guidelines' },
      { status: 500 }
    );
  }
}